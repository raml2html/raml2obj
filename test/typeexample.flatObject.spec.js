/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('typeexample.flatObject.raml', () => {
    let obj;

    before(done => {
      raml2obj
        .parse('test/typeexample.flatObject.raml', {
          collectionFormat: 'arrays',
        })
        .then(
          result => {
            obj = result;
            done();
          },
          error => {
            console.log('error', error);
          }
        );
    });

    it('should test the structure if the option "arraysToObjects" is set to "flatObjects"', () => {
      assert.strictEqual(
        // check that it's really an array without keys
        Object.prototype.toString.call(obj.types),
        '[object Array]'
      );
      assert.strictEqual(
        // check that it's really an Object
        Object(obj),
        obj
      );
      assert.strictEqual(
        // check that we can directly access a property inside the object (this is the actual difference the flag makes)
        obj.types[0].name,
        'objectid'
      );
      assert.strictEqual(
        // check that the type key is in a property inside the object
        obj.types[0].key,
        'objectid'
      );
      assert.strictEqual(
        // check that the second type is still the second
        obj.types[1].key,
        'objectType'
      );
      assert.strictEqual(
        // check that the second type's second property is still the second
        obj.types[1].properties[1].key,
        'second'
      );
    });
  });
});
