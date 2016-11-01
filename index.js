#!/usr/bin/env node

'use strict';

const raml = require('raml-1-parser');
const tools = require('datatype-expansion');
const fs = require('fs');

function _makeUniqueId(string) {
  const stringWithSpacesReplaced = string.replace(/\W/g, '_');
  const stringWithLeadingUnderscoreRemoved = stringWithSpacesReplaced.replace(new RegExp('^_+'), '');
  return stringWithLeadingUnderscoreRemoved.toLowerCase();
}

function _isObject(obj) {
  return obj === Object(obj);
}

// EXAMPLE INPUT:
// {
//   foo: {
//     name: "foo!"
//   },
//   bar: {
//     name: "bar"
//   }
// }
//
// EXAMPLE OUTPUT:
// [ { name: "foo!", key: "foo" }, { name: "bar", key: "bar" } ]
function _objectToArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  }

  return Object.keys(obj).map((key) => {
    if (_isObject(obj[key])) {
      obj[key].key = key;
    }
    return obj[key];
  });
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

    // Since types are an array everywhere else, make sure they're also an array on the resource level
    if (resource.type && !Array.isArray(resource.type)) {
      resource.type = [resource.type];
    }

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

function _expandTypes(arr, types) {
  return arr.map((obj) => {
    if (obj.type && Array.isArray(obj.type)) {
      obj.type.forEach((type) => {
        if (types[type]) {
          Object.assign(obj, types[type]);
        }
      });

      if (obj.type.length === 1) {
        obj.type = obj.type[0];
      }
    }

    if (obj.items && types[obj.items]) {
      obj.items = types[obj.items];
    }

    return obj;
  });
}

function _makeExamplesConsistent(arr) {
  return arr.map((obj) => {
    if (obj.examples && obj.examples.length) {
      obj.examples = obj.examples.map(example => (example.value ? example.value : example));
    }

    if (obj.structuredExample) {
      if (typeof obj.examples === 'undefined') {
        obj.examples = [];
      }

      obj.examples.push(obj.structuredExample.value);
      delete obj.example;
      delete obj.structuredExample;
    }

    return obj;
  });
}

function _recursiveObjectToArray(obj, types) {
  if (_isObject(obj)) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (_isObject(obj) && ['responses', 'body', 'queryParameters', 'headers', 'properties', 'baseUriParameters', 'annotations'].indexOf(key) !== -1) {
        obj[key] = _objectToArray(value);

        if (types) {
          obj[key] = _expandTypes(obj[key], types);
        }

        obj[key] = _makeExamplesConsistent(obj[key]);
      }

      _recursiveObjectToArray(value, types);
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((value) => {
      _recursiveObjectToArray(value, types);
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

// This uses the datatype-expansion library to expand all the root type to their canonical expanded form
function _expandRootTypes(types) {
  if (!types) {
    return types;
  }

  Object.keys(types).forEach((key) => {
    tools.expandedForm(types[key], types, (err, expanded) => {
      if (expanded) {
        tools.canonicalForm(expanded, (err, canonical) => {
          if (canonical) {
            types[key] = canonical;
          }
        });
      }
    });
  });

  return types;
}

function _enhanceRamlObj(ramlObj) {
  ramlObj = _traverse(ramlObj);

  // Some of the structures (like `types`) are an array that hold key/value pairs, which is very annoying to work with.
  // Let's make them into a simple object, this makes it easy to use them for direct lookups.
  //
  // EXAMPLE of these structures:
  // [
  //   { foo: { ... } },
  //   { bar: { ... } },
  // ]
  //
  // EXAMPLE of what we want:
  // { foo: { ... }, bar: { ... } }
  ramlObj = _arraysToObjects(ramlObj);

  // We want to expand inherited root types, so that later on when we copy type properties into an object,
  // we get the full graph.
  // Delete the types from the ramlObj so it's not processed again later on.
  const types = _expandRootTypes(ramlObj.types);
  delete ramlObj.types;

  // Other structures (like `responses`) are an object that hold other wrapped objects.
  // Flatten this to simple (non-wrapped) objects in an array instead,
  // this makes it easy to loop over them in raml2html / raml2md.
  //
  // EXAMPLE of these structures:
  // {
  //   foo: {
  //     name: "foo!"
  //   },
  //   bar: {
  //     name: "bar"
  //   }
  // }
  //
  // EXAMPLE of what we want:
  // [ { name: "foo!", key: "foo" }, { name: "bar", key: "bar" } ]
  ramlObj = _recursiveObjectToArray(ramlObj, types);

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

        return result.expand(true).toJSON({ serializeMetadata: false });
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
  return _sourceToRamlObj(source).then(ramlObj => _enhanceRamlObj(ramlObj));
};
