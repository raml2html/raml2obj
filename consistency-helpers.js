function _isObject(obj) {
  return obj === Object(obj);
}

function makeConsistent(obj, types) {
  if (_isObject(obj)) {
    const ignoredKeys = { rawType: true };
    if (obj.type) {
      if (Array.isArray(obj.type)) {
        obj.type = obj.type[0];
      }

      if (
        obj.type === 'array' &&
        Array.isArray(obj.items) &&
        obj.items.length === 1
      ) {
        obj.items = obj.items[0];
      }

      if (types && types[obj.type]) {
        const examples = obj.examples;
        const mergedObj = Object.assign({}, obj, types[obj.type]);

        // Every exception of inheritance should be deleted from mergedObj
        if (obj.description && types[obj.type].description) {
          delete mergedObj.description;
        }

        if (examples) {
          mergedObj.examples = examples;
        }

        Object.assign(obj, mergedObj);
        ignoredKeys.type = true;
      }
    }

    if (obj.items && types && types[obj.items]) {
      obj.items = types[obj.items];
      ignoredKeys.items = true;
    }

    if (obj.structuredExample) {
      if (typeof obj.examples === 'undefined') {
        obj.examples = [];
      }

      obj.examples.push(obj.structuredExample);
      delete obj.example;
      delete obj.structuredExample;
    }

    if (obj.examples && obj.examples.length) {
      obj.examples = obj.examples.map(example => {
        if (!example.value) {
          return { value: example };
        }
        if (!example.displayName && example.name) {
          example.displayName = example.name;
        }
        return example;
      });
    }

    // Give each security scheme a displayName if it isn't already set
    if (obj.securitySchemes) {
      Object.keys(obj.securitySchemes).forEach(schemeName => {
        const scheme = obj.securitySchemes[schemeName];
        scheme.displayName = scheme.displayName || scheme.name;
      });
    }

    if (Array.isArray(obj.securedBy)) {
      if (
        obj.securedBy.length === 0 ||
        obj.securedBy.every(scheme => scheme === null)
      ) {
        // The RAML 1.0 spec allows that:
        //  "A securedBy node containing null as the array component indicates
        //   the method can be called without applying any security scheme."
        delete obj.securedBy;
      } else {
        // Guarantee that all elements of the securedBy array are either null or
        // objects containing a schemeName property (and an optional scopes property)
        obj.securedBy = obj.securedBy.map(scheme => {
          if (scheme === null) {
            return null;
          }
          if (typeof scheme === 'string') {
            return { schemeName: scheme };
          }
          const schemeName = Object.keys(scheme)[0];
          return Object.assign({ schemeName }, scheme[schemeName] || {});
        });
      }
    }

    // Fix inconsistency between request headers and response headers from raml-1-parser.
    // https://github.com/raml-org/raml-js-parser-2/issues/582
    // TODO this issue is fixed since 26 Sep 2017, i.e. v1.1.32, could be removed
    if (Array.isArray(obj.headers)) {
      obj.headers.forEach(hdr => {
        if (typeof hdr.key === 'undefined' && hdr.name) {
          hdr.key = hdr.name;
        }
      });
    }

    Object.keys(obj).forEach(key => {
      // Don't recurse into types, which have already been canonicalized.
      if (!(key in ignoredKeys)) {
        makeConsistent(obj[key], types);
      }
    });
  } else if (Array.isArray(obj)) {
    obj.forEach(value => {
      makeConsistent(value, types);
    });
  }

  return obj;
}

module.exports = makeConsistent;
