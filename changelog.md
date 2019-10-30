6.6.0 - Oct 30, 2019
- Updated dependencies

6.5.0 - June 13, 2019
- Allow for 'parse' to accept raw input (e.g. string or Buffer)

6.4.0 - May 29, 2019
- Array output format and orderHints in object output (via options flag)

6.3.0 - May 29, 2019
- Add support for RAML parser resolvers options

6.2.0 - April 2, 2019
- Updated dependencies

6.1.0 - September 7, 2018
- Added options.extensionsAndOverlays
- Updated dependencies

6.0.0 - February 19, 2018
- Updated datatype-expansion to 0.3.x, which fixes invalid hoisting of unions outside of array items, as well as several other issues
- Enabled tracking of original type in datatype-expansion, so that themes can reference base types
- Tracking rawType of canonicalized types, so that themes can distinguish between declared annotations and inherited annotations

5.9.0 - January 9, 2018
- Updated raml-1-parser to 1.1.36, plus devDependencies like eslint, prettier, and mocha

5.8.0 - December 6, 2017
- Updated datatype-expansion dependency to 0.2.6

5.7.0 - November 3, 2017
- Updated datatype-expansion dependency to 0.2.4
- Updated raml-1-parser to 1.1.36

5.6.0 - September 27, 2017
- Updated raml-1-parser

5.5.0 - June 5, 2017
- Prefer taking examples from higher level items instead of types (#41)
- Update raml-1-parser dependency

5.4.0 - May 3, 2017
- Updated third party dependencies

5.3.0 - April 25, 2017
- Updated third party dependencies
- By default we're no longer using raml-1-parser's rejectOnErrors option since it's very slow (raml2html/raml2html#345)

5.2.1 - April 14, 2017
- Updated third party dependencies

5.2.0 - March 24, 2017
- Updated raml-1-parser dependency

5.1.0 - March 1, 2017
- Updated raml-1-parser dependency

5.0.0 - February 15, 2017
- Breaking change: updated mapping of securitySchemes and securedBy
- Fixed an issue with some array type declarations having inconsistent item type definitions (raml2html/raml2html#323) (#29)

4.1.0 - January 27, 2017
- Added extra properties to examples (#22)
- Updated raml-js-parser-2 dependancy (#25)
- Fixed types' parent overriding behaviour (#26)

4.0.4 - January 10, 2017
- Fix response headers inconsistency (#23)

4.0.3 - December 29, 2016
- Made securedBy: [ null] consistent with no security

4.0.2 - December 8, 2016
- Fixed more Node 4 problems, now actually tested via NVM

4.0.1 - December 7, 2016
- Fixed Node 4 support

4.0.0 - December 1, 2016
- After almost 4 months of development, it's done: 4.0.0 with RAML 1 support, and a much more consistent output. And a whole lot of unit tests!
- Breaking change: removed support for RAML 0.8 files
- Breaking change: the output of raml2obj has changed

4.0.0-beta16 - November 30, 2016
- Updated raml-1-parser to 1.1.9 (#18)

4.0.0-beta15 - November 21, 2016
- Downgraded datatype-expansion library
- Making all the types consistent ourselves now, always an array

4.0.0-beta14 - November 21, 2016
- Updated datatype-expansion library

4.0.0-beta13 - November 2, 2016
- Correctly expanding types within uriParameters
- Updated datatype-expansion and raml-1-parser

4.0.0-beta12 - November 1, 2016
- Handling `array` types with `items` by expanding the items into a type object

4.0.0-beta11 - November 1, 2016
- Updated datatype-expansion to 0.0.14

4.0.0-beta10 - October 31, 2016
- Updated raml-1-parser to 1.1.6

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
