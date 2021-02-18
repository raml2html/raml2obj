/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('examples-not-polluted.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/examples-not-polluted.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('examples should not be polluted with previous usages', () => {
      // Take the first value example to verify is not in the type examples
      const [ramlExample] = obj.resources.map(
        rsc => rsc.methods[0].allUriParameters[0].examples[0].value
      );
      // Take all type examples
      const typeExamples = obj.types.TypeId.examples.map(
        example => example.value
      );
      typeExamples.forEach(typeExample => {
        assert.notStrictEqual(ramlExample, typeExample);
      });
    });
  });
});
