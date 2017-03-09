/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('typeexample.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/typeexample.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('should test the array items', () => {
      const uriParameter = obj.resources[0].uriParameters[0];
      assert.strictEqual(
        uriParameter.description,
        'A valid MongoDB object id.'
      );
      assert.strictEqual(
        uriParameter.examples[0].value,
        '576bca8b70fddb149c4a9e92'
      );
    });
  });
});
