# RAML to object

[![NPM version](http://img.shields.io/npm/v/raml2obj.svg)](https://www.npmjs.org/package/raml2obj)
[![js-standard-style](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat)](https://github.com/airbnb/javascript)

A thin wrapper around [raml-parser](https://www.npmjs.org/package/raml-parser), adding extra properties to the resulting
object for use in [raml2html](https://www.npmjs.org/package/raml2html) and [raml2md](https://www.npmjs.org/package/raml2md).


## Install
```
npm i raml2obj --save
```


## Usage
```
var raml2obj = require('raml2obj');

// source can either be a filename, url, file contents (string) or parsed RAML object.
// Returns a promise.
raml2obj.parse(source).then(function(ramlObj) {
  // Do something with the resulting ramlObj :)
});
```


## Contribute
raml2obj is an open source project and your contribution is very much appreciated.

1. Check for open issues or open a fresh issue to start a discussion around a feature idea or a bug.
2. Fork the repository on Github and make your changes on the **develop** branch (or branch off of it).  
   Please retain the [code style](https://github.com/airbnb/javascript) that is used in the project and `npm run lint` before committing.
3. Add an example of the new feature to example.raml (if applicable)
4. Send a pull request (with the develop branch as the target).

A big thank you goes out to everyone who helped with the project, the [contributors](https://github.com/kevinrenskers/raml2obj/graphs/contributors)
and everyone who took the time to report issues and give feedback.


## License
raml2obj is available under the MIT license. See the LICENSE file for more info.
