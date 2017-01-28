function _isObject(obj) {
  return obj === Object(obj);
}

function makeConsistent(obj, types) {
  if (_isObject(obj)) {
    if (obj.type) {
      if (Array.isArray(obj.type)) {
        obj.type = obj.type[0];
      }

      if (types && types[obj.type]) {
        const mergedObj = Object.assign({}, obj, types[obj.type]);

        // Every exception of inheritance should be deleted from mergedObj
        if (obj.description && types[obj.type].description) {
          delete mergedObj.description;
        }

        Object.assign(obj, mergedObj);
      }
    }

    if (obj.items && types && types[obj.items]) {
      obj.items = types[obj.items];
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
      obj.examples = obj.examples.map((example) => {
        if (!example.value) {
          return { value: example };
        }
        if (!example.displayName && example.name) {
          example.displayName = example.name;
        }
        return example;
      });
    }

    // The RAML 1.0 spec allows that:
    //  "A securedBy node containing null as the array component indicates
    //   the method can be called without applying any security scheme."
    if (Array.isArray(obj.securedBy) && obj.securedBy.length === 1 && obj.securedBy[0] === null) {
      delete obj.securedBy;
    }

    // Fix inconsistency between request headers and response headers from raml-1-parser.
    // https://github.com/raml-org/raml-js-parser-2/issues/582
    if (Array.isArray(obj.headers)) {
      obj.headers.forEach((hdr) => {
        if (typeof hdr.key === 'undefined' && hdr.name) {
          hdr.key = hdr.name;
        }
      });
    }

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      makeConsistent(value, types);
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((value) => {
      makeConsistent(value, types);
    });
  }

  return obj;
}

module.exports = makeConsistent;
