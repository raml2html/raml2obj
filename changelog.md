4.0.0-beta9 - October 14, 2016
- Types are just a string instead of an array

4.0.0-beta8 - October 14, 2016
- Updated raml-1-parser to 1.1.5
- Fixed handling of type inheritance (#15)

4.0.0-beta7 - October 4, 2016
- Fixed JS error when `body` is used as a property (#14)
- Removed all the empty examples arrays
- Fixed `key` properties that were sometimes integers

4.0.0-beta6 - September 29, 2016
- Fixed examples array

4.0.0-beta5 - September 29, 2016
- Always return an `examples` array containing simple strings

4.0.0-beta4 - September 29, 2016
- Expanding types where possible
- Added more unit tests

4.0.0-beta3 - September 23, 2016
- Limit the `files` that are sent to NPM

4.0.0-beta2 - September 22, 2016
- Updated raml-1-parser to 1.1.3
- Added a bunch of unit tests
- Breaking change: removed support for RAML 0.8 files
- Breaking change: the output of raml2obj has changed

4.0.0-beta1 - August 10, 2016
- Using the new raml-1-parser which support RAML 1.0 as well as 0.8
- Breaking change: raml-1-parser doesn't support string or buffer sources anymore

3.0.0 - August 10, 2016
- Released without further changes

3.0.0-beta2 - August 8, 2016
- Fix JS error

3.0.0-beta1 - August 7, 2016
- Updated code to use ES6 syntax
- The securitySchemeWithName helper function is now part of raml2obj
- Breaking change: Node 4 or higher is now required!

2.2.0 - July 16, 2015
- Update third party dependencies

2.1.0 - May 22, 2015
- Renamed raml2obj.js to index.js
- Trim the left underscore from the uniqueId's

2.0.0 - March 13, 2015
- Using a promise based API, please see README for updated usage example

1.0.0 - January 26, 2015
- Finalized API, the parse method is all we need
- Removed FileReader export

0.5.0 - January 21, 2015
- Copy resource allUriParameters to its methods

0.4.0 - January 14, 2015
- Export FileReader object

0.3.0 - September 25, 2014
- Allow remote urls to be loaded

0.2.1 - July 8, 2014
- Critical bugfix

0.2.0 - July 8, 2014
- Adding the unique id's to top level documentation chapters has been moved from raml2html to raml2obj

0.1.0 - June 12, 2014
- Initial release of standalone raml2obj
