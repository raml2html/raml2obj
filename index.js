#!/usr/bin/env node

'use strict';

var raml = require('raml-parser');
var fs = require('fs');
var Q = require('q');
var _opts = {};

function _parseBaseUri(ramlObj) {
  // I have no clue what kind of variables the RAML spec allows in the baseUri.
  // For now keep it super super simple.
  if (ramlObj.baseUri) {
    ramlObj.baseUri = ramlObj.baseUri.replace('{version}', ramlObj.version);
  }

  return ramlObj;
}

function _ltrim(str, chr) {
  var rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp('^' + chr + '+');
  return str.replace(rgxtrim, '');
}

function _makeUniqueId(resource) {
  var fullUrl = resource.parentUrl + resource.relativeUri;
  return _ltrim(fullUrl.replace(/\W/g, '_'), '_');
}

function _traverse(ramlObj, parentUrl, allUriParameters) {
  // Add unique id's and parent URL's plus parent URI parameters to resources
  for (var index in ramlObj.resources) {
    if (ramlObj.resources.hasOwnProperty(index)) {
      var resource = ramlObj.resources[index];
      resource.parentUrl = parentUrl || '';
      resource.uniqueId = _makeUniqueId(resource);
      resource.allUriParameters = [];

      if (allUriParameters) {
        resource.allUriParameters.push.apply(resource.allUriParameters, allUriParameters);
      }

      if (resource.uriParameters) {
        for (var key in resource.uriParameters) {
          if (resource.uriParameters.hasOwnProperty(key)) {
            resource.allUriParameters.push(resource.uriParameters[key]);
          }
        }
      }

      if (resource.methods) {
        for (var methodkey in resource.methods) {
          if (resource.methods.hasOwnProperty(methodkey)) {
            resource.methods[methodkey].allUriParameters = resource.allUriParameters;
            _traverseMethod(resource.methods[methodkey]);
          }
        }
      }

      _traverse(resource, resource.parentUrl + resource.relativeUri, resource.allUriParameters);
    }
  }

  return ramlObj;
}

function _traverseMethod(method) {
  _traverseBody(method.body);
  if (method.responses) {
    for (var responseKey in method.responses) {
      _traverseBody(method.responses[responseKey].body);
    }
  }
}

function _traverseBody(body) {
  if (body) {
    for (var k in body) {
      if (body[k].schema && _opts.flattenSchema) {
        body[k].flatSchema = _flatten(null, JSON.parse(body[k].schema));
      }
    }
  }
}

/**
 * Flattens a schema object into a single level map, using dot notation for fields and brackets
 * to denote array. This method will be recursively called for all nested objects.
 * This flatSchema can then be used in raml renderers to display the schema in a single flat table.
 * Example:
 * {
 *    type: "object",
 *    properties: {
 *      field1: {
 *         description: "desc1",
 *         type: "array",
 *         items: { type: "string", description: "desc2" }
 *      }
 *      field2: {
 *        type: "object",
 *        description: "desc3",
 *        properties: {
 *          field3: { type: "number", description: "desc4" }
 *        }
 *      }
 *    }
 *  }
 * Would become:
 * {
 *    "field1" : { type: "array", description: "desc1" },
 *    "field1[]" : { type: "string", description: "desc2" },
 *    "field2" : { type: "object", description: "desc3" },
 *    "field2.field3" : { type: "number", description: "desc4" }
 * }
 */
function _flatten(key, obj) {
  var propMap = {};

  if (key) propMap[key] = obj;

  if (obj.type === 'array') {
    var itemsMap = _flatten(key + '[]', obj.items);
    for (var k in itemsMap) {
      propMap[k] = itemsMap[k];
    }
    delete obj.items;
  } else if (obj.type === 'object') {
    for (var propKey in obj.properties) {
      var propPropMap = _flatten(propKey, obj.properties[propKey]);
      for (var k in propPropMap) {
        var nestedKey = key == null ? k : key + '.' + k;
        propMap[nestedKey] = propPropMap[k];
      }
    }
    delete obj.properties;
  }
  return propMap;
}

function _addUniqueIdsToDocs(ramlObj) {
  // Add unique id's to top level documentation chapters
  for (var idx in ramlObj.documentation) {
    if (ramlObj.documentation.hasOwnProperty(idx)) {
      var docSection = ramlObj.documentation[idx];
      docSection.uniqueId = docSection.title.replace(/\W/g, '-');
    }
  }

  return ramlObj;
}

function _enhanceRamlObj(ramlObj) {
  ramlObj = _parseBaseUri(ramlObj);
  ramlObj = _traverse(ramlObj);
  return _addUniqueIdsToDocs(ramlObj);
}

function _sourceToRamlObj(source) {
  if (typeof source === 'string') {
    if (fs.existsSync(source) || source.indexOf('http') === 0) {
      // Parse as file or url
      return raml.loadFile(source);
    }

    // Parse as string or buffer
    return raml.load('' + source);
  } else if (source instanceof Buffer) {
    // Parse as buffer
    return raml.load('' + source);
  } else if (typeof source === 'object') {
    // Parse RAML object directly
    return Q.fcall(function() {
      return source;
    });
  }

  return Q.fcall(function() {
    throw new Error('_sourceToRamlObj: You must supply either file, url, data or obj as source.');
  });
}

function parse(source) {
  return _sourceToRamlObj(source).then(function(ramlObj) {
    return _enhanceRamlObj(ramlObj);
  });
}

function opts(o) {
  _opts = o;
}

module.exports.parse = parse;
module.exports.opts = opts;
