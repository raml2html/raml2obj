# RAML to object

[![NPM version](http://img.shields.io/npm/v/raml2obj.svg)](https://www.npmjs.org/package/raml2obj)
[![Prettier](https://img.shields.io/badge/code%20style-prettier-blue.svg?style=flat)](https://github.com/prettier/prettier)

A thin wrapper around [raml-js-parser-2](https://github.com/raml-org/raml-js-parser-2), adding extra properties to the resulting
object for use in [raml2html](https://www.npmjs.org/package/raml2html) and [raml2md](https://www.npmjs.org/package/raml2md).

Versions 4.0.0 and up only support RAML 1.x files. If you still have RAML 0.8 source files, please stick with raml2obj 3.

## Install
```
npm i raml2obj --save
```


## Usage
```js
var raml2obj = require('raml2obj');

// source can either be a filename, url, or parsed RAML object.
// Returns a promise.
raml2obj.parse(source).then(function(ramlObj) {
  // Do something with the resulting ramlObj :)
});
```

## Questions & Support
Do you have a question? Have you found a bug or would you like to request a feature? Please check out [`CONTRIBUTING.md`](CONTRIBUTING.md).


## License
raml2obj is available under the MIT license. See the LICENSE file for more info.
