/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('consistent-headers.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/consistent-headers.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('should have keys on both request and response headers', () => {
      assert.strictEqual(
        obj.resources[0].methods[0].headers[0].key,
        'X-Some-Header'
      );
      assert.strictEqual(
        obj.resources[0].methods[0].responses[0].headers[0].key,
        'X-Some-Other-Header'
      );
    });
  });
});
