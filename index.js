#!/usr/bin/env node

'use strict';

const raml = require('raml-1-parser');
const fs = require('fs');

function _makeUniqueId(string) {
  const stringWithSpacesReplaced = string.replace(/\W/g, '_');
  const stringWithLeadingUnderscoreRemoved = stringWithSpacesReplaced.replace(new RegExp('^_+'), '');
  return stringWithLeadingUnderscoreRemoved.toLowerCase();
}

// EXAMPLE INPUT:
// {
//   foo: {
//     name: "foo"
//   },
//   bar: {
//     name: "bar"
//   }
// }
//
// EXAMPLE OUTPUT:
// [ { name: "foo" }, { name: "bar" } ]
function _objectToArray(obj) {
  return Object.keys(obj).map((key) => obj[key]);
}

function _traverse(ramlObj, parentUrl, allUriParameters) {
  // Add unique id's and parent URL's plus parent URI parameters to resources
  if (!ramlObj.resources) {
    return ramlObj;
  }

  ramlObj.resources.forEach((resource) => {
    resource.parentUrl = parentUrl || '';
    resource.uniqueId = _makeUniqueId(resource.parentUrl + resource.relativeUri);
    resource.allUriParameters = [];

    if (allUriParameters) {
      resource.allUriParameters.push.apply(resource.allUriParameters, allUriParameters);
    }

    if (resource.uriParameters) {
      resource.uriParameters = _objectToArray(resource.uriParameters);

      resource.uriParameters.forEach((uriParameter) => {
        resource.allUriParameters.push(uriParameter);
      });
    }

    if (resource.methods) {
      resource.methods.forEach((method) => {
        method.allUriParameters = resource.allUriParameters;
      });
    }

    _traverse(resource, resource.parentUrl + resource.relativeUri, resource.allUriParameters);
  });

  return ramlObj;
}

function _isObject(obj) {
  return obj === Object(obj);
}

function _recursiveObjectToArray(obj) {
  if (_isObject(obj)) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (_isObject(obj) && ['responses', 'body', 'queryParameters', 'headers', 'properties', 'baseUriParameters'].indexOf(key) !== -1) {
        obj[key] = _objectToArray(value);
      }

      _recursiveObjectToArray(value);
    });
  }

  if (Array.isArray(obj)) {
    obj.forEach((value) => {
      _recursiveObjectToArray(value);
    });
  }

  return obj;
}

// EXAMPLE INPUT:
// [
//   { foo: { ... } },
//   { bar: { ... } },
// ]
//
// EXAMPLE OUTPUT:
// { foo: { ... }, bar: { ... } }
function _arrayToObject(arr) {
  return arr.reduce((acc, cur) => {
    Object.keys(cur).forEach((key) => {
      acc[key] = cur[key];
    });
    return acc;
  }, {});
}

function _arraysToObjects(ramlObj) {
  ['types', 'traits', 'resourceTypes', 'annotationTypes', 'securitySchemes'].forEach((key) => {
    if (ramlObj[key]) {
      ramlObj[key] = _arrayToObject(ramlObj[key]);
    }
  });

  return ramlObj;
}

function _enhanceRamlObj(ramlObj) {
  ramlObj = _traverse(ramlObj);

  // The RAML output is kinda annoying. Some things are a pretty useless objects, while others are an array of objects.
  // Let's make this consistent and just transform all these things to arrays of objects (see _objectToArray).
  ramlObj = _recursiveObjectToArray(ramlObj);

  // Some other structures are different still: an array of objects wrapped in other objects.
  // Let's also make this consistent (see _arraysToObjects).
  ramlObj = _arraysToObjects(ramlObj);

  // TODO: ramlObj.uses is currently completely useless
  // Do we need to parse the values, which are links to other RAML files, or is raml-1-parser going to do this?

  // Add unique id's to top level documentation chapters
  if (ramlObj.documentation) {
    ramlObj.documentation.forEach((docSection) => {
      docSection.uniqueId = _makeUniqueId(docSection.title);
    });
  }

  return ramlObj;
}

function _sourceToRamlObj(source) {
  if (typeof source === 'string') {
    if (fs.existsSync(source) || source.indexOf('http') === 0) {
      // Parse as file or url
      return raml.loadApi(source, { rejectOnErrors: true }).then((result) => {
        if (result._node._universe._typedVersion === '0.8') {
          throw new Error('_sourceToRamlObj: only RAML 1.0 is supported!');
        }

        const expandedResult = result.expand();
        expandedResult.expandLibraries();
        return expandedResult.toJSON();
      });
    }

    return new Promise((resolve, reject) => {
      reject(new Error('_sourceToRamlObj: source does not exist.'));
    });
  } else if (typeof source === 'object') {
    // Parse RAML object directly
    return new Promise((resolve) => {
      resolve(source);
    });
  }

  return new Promise((resolve, reject) => {
    reject(new Error('_sourceToRamlObj: You must supply either file, url or object as source.'));
  });
}

module.exports.parse = function (source) {
  return _sourceToRamlObj(source).then((ramlObj) => _enhanceRamlObj(ramlObj));
};
