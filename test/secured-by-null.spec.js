/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('secured-by-null.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/secured-by-null.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should make securedBy consistent', () => {
      const A = obj.resources[0];
      const B = obj.resources[1];
      const C = obj.resources[2];
      assert.strictEqual(A.relativeUri, '/A');
      assert.strictEqual(B.relativeUri, '/B');
      assert.strictEqual(C.relativeUri, '/C');
      assert.strictEqual(A.methods[0].securedBy, undefined);
      assert.strictEqual(B.methods[0].securedBy, undefined);
      assert.strictEqual(C.methods[0].securedBy.length, 1);
      assert.deepEqual(C.methods[0].securedBy, [{schemeName: 'oauth_2_0'}]);
    });
  });
});
