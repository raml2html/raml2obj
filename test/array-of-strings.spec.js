/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('array-of-strings.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/array-of-strings.raml').then(
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
      let body;

      body = obj.resources[0].methods[0].responses[0].body[0];
      assert.strictEqual(body.type, 'array');
      assert.strictEqual(body.items, 'string');

      body = obj.resources[0].methods[1].responses[0].body[0];
      assert.strictEqual(body.type, 'array');
      assert.strictEqual(body.items, 'string');
    });
  });
});
