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

## Options
The `parse()` function can be called with options to customize the result. 
Defaults are compatible with `raml2html`.

```js
raml2obj.parse(source, {
  validate: true, 
  extensionsAndOverlays : [], 
  collectionFormat: 'arrays',
}).then(function(ramlObj) {
  // Do something with the resulting ramlObj :)
});
```
 * `validate`: triggers the `rejectOnErrors` flag of the underlying parser. defaults to `false`
 * `extensionsAndOverlays`:  Defaults to `[]`. See parser documentation.
 * `collectionFormat`: choose what data structure the double-nested `[{name1: {..}}, {name2: {..}}]` patterns of the `raml-1-parser` are transformed to in the output object:
  
| `collectionFormat` value | output |
| --- | --- |
|`objects` (*default*)|`{name1: { orderHint: 0, ..}, name2: { orderHint: 1, ..}}`  (eases e.g. property access). *Applies to top-level collections only, nested are arrays except type properties.*|
|`arrays`|`[ {key: "name1", ..}, {key: "name2", ..}]`  (eases e.g. representation in a database). *Applies recursively everywhere.* |


## Questions & Support
Do you have a question? Have you found a bug or would you like to request a feature? Please check out [`CONTRIBUTING.md`](CONTRIBUTING.md).


## License
raml2obj is available under the MIT license. See the LICENSE file for more info.
