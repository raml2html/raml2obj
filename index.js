#!/usr/bin/env node

'use strict';

const raml = require('raml-parser');
const fs = require('fs');

function _parseBaseUri(ramlObj) {
  // I have no clue what kind of variables the RAML spec allows in the baseUri.
  // For now keep it super super simple.
  if (ramlObj.baseUri) {
    ramlObj.baseUri = ramlObj.baseUri.replace('{version}', ramlObj.version);
  }

  return ramlObj;
}

function _ltrim(str, chr) {
  const rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp(`^${chr}+`);
  return str.replace(rgxtrim, '');
}

function _makeUniqueId(resource) {
  const fullUrl = resource.parentUrl + resource.relativeUri;
  return _ltrim(fullUrl.replace(/\W/g, '_'), '_');
}

function _traverse(ramlObj, parentUrl, allUriParameters) {
  // Add unique id's and parent URL's plus parent URI parameters to resources
  if (!ramlObj.resources) {
    return ramlObj;
  }

  ramlObj.resources.forEach((resource) => {
    resource.parentUrl = parentUrl || '';
    resource.uniqueId = _makeUniqueId(resource);
    resource.allUriParameters = [];

    if (allUriParameters) {
      resource.allUriParameters.push.apply(resource.allUriParameters, allUriParameters);
    }

    if (resource.uriParameters) {
      Object.keys(resource.uriParameters).forEach((key) => {
        resource.allUriParameters.push(resource.uriParameters[key]);
      });
    }

    if (resource.methods) {
      Object.keys(resource.methods).forEach((methodkey) => {
        resource.methods[methodkey].allUriParameters = resource.allUriParameters;
      });
    }

    _traverse(resource, resource.parentUrl + resource.relativeUri, resource.allUriParameters);
  });

  return ramlObj;
}

function _addUniqueIdsToDocs(ramlObj) {
  // Add unique id's to top level documentation chapters
  if (ramlObj.documentation) {
    ramlObj.documentation.forEach((docSection) => {
      docSection.uniqueId = docSection.title.replace(/\W/g, '-');
    });
  }

  return ramlObj;
}

function _enhanceRamlObj(ramlObj) {
  ramlObj = _parseBaseUri(ramlObj);
  ramlObj = _traverse(ramlObj);

  // Add extra function for finding a security scheme by name
  ramlObj.securitySchemeWithName = function (name) {
    if (ramlObj.securitySchemes) {
      const result = ramlObj.securitySchemes.find(s => s[name]);
      if (result) {
        return result[name];
      }
    }
    return {};
  };

  return _addUniqueIdsToDocs(ramlObj);
}

function _sourceToRamlObj(source) {
  if (typeof source === 'string') {
    if (fs.existsSync(source) || source.indexOf('http') === 0) {
      // Parse as file or url
      return raml.loadFile(source);
    }

    // Parse as string or buffer
    return raml.load(String(source));
  } else if (source instanceof Buffer) {
    // Parse as buffer
    return raml.load(String(source));
  } else if (typeof source === 'object') {
    // Parse RAML object directly
    return new Promise((resolve) => {
      resolve(source);
    });
  }

  return new Promise((resolve, reject) => {
    reject(new Error('_sourceToRamlObj: You must supply either file, url, data or obj as source.'));
  });
}

function parse(source) {
  return _sourceToRamlObj(source).then((ramlObj) => _enhanceRamlObj(ramlObj));
}

module.exports.parse = parse;
