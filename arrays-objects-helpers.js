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

  return Object.keys(obj).map(key => {
    if (_isObject(obj[key])) {
      obj[key].key = key;
    }
    return obj[key];
  });
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
    Object.keys(cur).forEach(key => {
      acc[key] = cur[key];
    });
    return acc;
  }, {});
}

// PUBLIC

function recursiveObjectToArray(obj) {
  if (_isObject(obj)) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (
        _isObject(obj) &&
        [
          'responses',
          'body',
          'queryParameters',
          'headers',
          'properties',
          'baseUriParameters',
          'annotations',
          'uriParameters',
        ].indexOf(key) !== -1
      ) {
        obj[key] = _objectToArray(value);
      }

      recursiveObjectToArray(value);
    });
  } else if (Array.isArray(obj)) {
    obj.forEach(value => {
      recursiveObjectToArray(value);
    });
  }

  return obj;
}

// Transform some TOP LEVEL properties from arrays to simple objects
function arraysToObjects(ramlObj) {
  [
    'types',
    'traits',
    'resourceTypes',
    'annotationTypes',
    'securitySchemes',
  ].forEach(key => {
    if (ramlObj[key]) {
      ramlObj[key] = _arrayToObject(ramlObj[key]);
    }
  });

  return ramlObj;
}

module.exports = {
  arraysToObjects,
  recursiveObjectToArray,
};
