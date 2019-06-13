#!/usr/bin/env node

'use strict';

const raml = require('raml-1-parser');
const tools = require('datatype-expansion');
const fs = require('fs');
const makeExamplesAndTypesConsistent = require('./consistency-helpers');
const helpers = require('./arrays-objects-helpers');

function _makeUniqueId(string) {
  const stringWithSpacesReplaced = string.replace(/\W/g, '_');
  const stringWithLeadingUnderscoreRemoved = stringWithSpacesReplaced.replace(
    new RegExp('^_+'),
    ''
  );
  return stringWithLeadingUnderscoreRemoved.toLowerCase();
}

// Add unique id's and parent URL's plus parent URI parameters to resources
function _addRaml2htmlProperties(ramlObj, parentUrl, allUriParameters) {
  // Add unique id's to top level documentation chapters
  if (ramlObj.documentation) {
    ramlObj.documentation.forEach(docSection => {
      docSection.uniqueId = _makeUniqueId(docSection.title);
    });
  }

  if (!ramlObj.resources) {
    return ramlObj;
  }

  ramlObj.resources.forEach(resource => {
    resource.parentUrl = parentUrl || '';
    resource.uniqueId = _makeUniqueId(
      resource.parentUrl + resource.relativeUri
    );
    resource.allUriParameters = [];

    if (allUriParameters) {
      resource.allUriParameters.push.apply(
        resource.allUriParameters,
        allUriParameters
      );
    }

    if (resource.uriParameters) {
      resource.uriParameters.forEach(uriParameter => {
        resource.allUriParameters.push(uriParameter);
      });
    }

    // Copy the RESOURCE uri parameters to the METHOD, because that's where they will be rendered.
    if (resource.methods) {
      resource.methods.forEach(method => {
        method.allUriParameters = resource.allUriParameters;
      });
    }

    _addRaml2htmlProperties(
      resource,
      resource.parentUrl + resource.relativeUri,
      resource.allUriParameters
    );
  });

  return ramlObj;
}

// This uses the datatype-expansion library to expand all the root type to their canonical expanded form
function _expandRootTypes(types) {
  if (!types) {
    return types;
  }

  Object.keys(types).forEach(key => {
    try {
      const original = types[key];
      const expanded = tools.expandedForm(original, types, {
        trackOriginalType: true,
      });
      const canonical = tools.canonicalForm(expanded, { hoistUnions: false });
      // Save a reference to the type as defined in the RAML, so we can differentiate between declared
      // and inherited facets, particularly annotations.
      canonical.rawType = original;
      types[key] = canonical;
    } catch (err) {
      // Dump the error to stderr and continue with the non-canonical form
      console.error(
        'Warning: Unable to canonicalize type "' + key + '": ' + err.message
      );
    }
  });

  return types;
}

function _enhanceRamlObj(ramlObj, options) {
  // Override default options
  options = Object.assign(
    {
      collectionFormat: 'objects',
    },
    options
  );

  // Some of the structures (like `types`) are an array that hold key/value pairs, which is very annoying to work with.
  // Let's make them into a simple object, this makes it easy to use them for direct lookups.
  //
  // EXAMPLE of these structures:
  // [
  //   { foo: { ... } },
  //   { bar: { ... } },
  // ]
  //
  // EXAMPLE of what we want (default option "objects")
  // { foo: { ... }, bar: { ... } }
  //
  // EXAMPLE of what we want (option "arrays")
  // [ { key: "foo", ... }, { key: "bar", ... } ]
  // the "arrays" option will be evalulated at the very end to so the conversion and cleanup code
  // does not have to handle different data structures.
  ramlObj = helpers.arraysToObjects(ramlObj);

  // We want to expand inherited root types, so that later on when we copy type properties into an object,
  // we get the full graph.
  const types = makeExamplesAndTypesConsistent(_expandRootTypes(ramlObj.types));
  // Delete the types from the ramlObj so it's not processed again later on.
  delete ramlObj.types;

  // Recursively go over the entire object and make all examples and types consistent.
  ramlObj = makeExamplesAndTypesConsistent(ramlObj, types);

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
  ramlObj = helpers.recursiveObjectToArray(ramlObj);

  // Now add all the properties and things that we need for raml2html, stuff like the uniqueId, parentUrl,
  // and allUriParameters.
  ramlObj = _addRaml2htmlProperties(ramlObj);

  if (types) {
    ramlObj.types = types;
  }

  // convert to optional variations in the output structure:
  if (options.collectionFormat === 'arrays') {
    // repeat recursive to also clean up the types:
    ramlObj = helpers.recursiveObjectToArray(ramlObj);
    // modify the top-level collections to be arrays
    ramlObj = helpers.objectsToArrays(ramlObj);
  }

  return ramlObj;
}

function _validateLoadedRaml(ramlObj) {
  if (ramlObj._node._universe._typedVersion === '0.8') {
    throw new Error('_sourceToRamlObj: only RAML 1.0 is supported!');
  }

  if (ramlObj.expand) {
    return ramlObj.expand(true).toJSON({ serializeMetadata: false });
  }

  return new Promise((resolve, reject) => {
    reject(
      new Error(
        '_sourceToRamlObj: source could not be parsed. Is it a root RAML file?'
      )
    );
  });
}

function _sourceToRamlObj(source, options = {}) {
  // "options" was originally a validation flag
  if (typeof options === 'boolean') {
    options = { validate: options };
  }
  if (typeof source === 'string') {
    if (fs.existsSync(source) || source.indexOf('http') === 0) {
      // Parse as file or url
      return raml
        .loadApi(source, options.extensionsAndOverlays || [], {
          rejectOnErrors: !!options.validate,
          httpResolver: options.httpResolver,
          fsResolver: options.fsResolver,
        })
        .then(_validateLoadedRaml);
    } else if (source) {
      return raml
        .parseRAML(source, {
          rejectOnErrors: !!options.validate,
          httpResolver: options.httpResolver,
          fsResolver: options.fsResolver,
        })
        .then(_validateLoadedRaml);
    }

    return new Promise((resolve, reject) => {
      reject(
        new Error(
          '_sourceToRamlObj: source does not exist or cannot be parsed.'
        )
      );
    });
  } else if (source instanceof Buffer) {
    return raml
      .parseRAML(source.toString(), {
        rejectOnErrors: !!options.validate,
        httpResolver: options.httpResolver,
        fsResolver: options.fsResolver,
      })
      .then(_validateLoadedRaml);
  } else if (typeof source === 'object') {
    // Parse RAML object directly
    return new Promise(resolve => {
      resolve(source);
    });
  }

  return new Promise((resolve, reject) => {
    reject(
      new Error(
        '_sourceToRamlObj: You must supply either file, url or object as source.'
      )
    );
  });
}

module.exports.parse = function(source, options) {
  return _sourceToRamlObj(source, options).then(ramlObj =>
    _enhanceRamlObj(ramlObj, options)
  );
};
