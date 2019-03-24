/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('typeexample.flatObject.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/typeexample.flatObject.raml', {
        arraysTransform: "flatObject"
      }).then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('should test the differing structure if the option "arraysToObjects" is set to "flatObject"', () => {
      assert.strictEqual(
        // check that it's really an array without keys
        Object.prototype.toString.call(obj.types),
        "[object Array]"
      );
      assert.strictEqual(
        // check that it's really an Object
        Object(obj),
        obj
      );
      assert.strictEqual(
        // check that we can directly access the name (this is the actual difference the flag makes)
        obj.types[0].name,
        "objectid"
      );
    });

  });
});
