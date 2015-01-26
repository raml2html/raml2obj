#!/usr/bin/env node

'use strict';

var raml = require('raml-parser');
var fs = require('fs');

function _parseBaseUri(ramlObj) {
    // I have no clue what kind of variables the RAML spec allows in the baseUri.
    // For now keep it super super simple.
    if (ramlObj.baseUri){
        ramlObj.baseUri = ramlObj.baseUri.replace('{version}', ramlObj.version);
    }
    return ramlObj;
}

function _makeUniqueId(resource) {
    var fullUrl = resource.parentUrl + resource.relativeUri;
    return fullUrl.replace(/\W/g, '_');
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
                    }
                }
            }

            _traverse(resource, resource.parentUrl + resource.relativeUri, resource.allUriParameters);
        }
    }

    return ramlObj;
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

function _enhanceRamlObj(ramlObj, onSuccess) {
    ramlObj = _parseBaseUri(ramlObj);
    ramlObj = _traverse(ramlObj);
    ramlObj = _addUniqueIdsToDocs(ramlObj);
    onSuccess(ramlObj);
}

function _sourceToRamlObj(source, onSuccess, onError) {
    if (typeof(source) === 'string') {
        if (fs.existsSync(source) || source.indexOf('http') === 0) {
            // Parse as file or url
            raml.loadFile(source).then(onSuccess, onError);
        } else {
            // Parse as string or buffer
            raml.load('' + source).then(onSuccess, onError);
        }
    } else if (source instanceof Buffer) {
        // Parse as buffer
        raml.load('' + source).then(onSuccess, onError);
    } else if (typeof(source) === 'object') {
        // Parse RAML object directly
        process.nextTick(function() {
            onSuccess(source);
        });
    } else {
        onError(new Error('sourceToRamlObj: You must supply either file, url, data or obj as source.'));
    }
}

function parse(source, onSuccess, onError) {
    _sourceToRamlObj(source, function(ramlObj) {
        _enhanceRamlObj(ramlObj, onSuccess);
    }, onError);
}

module.exports.parse = parse;
