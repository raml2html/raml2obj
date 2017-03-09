/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('secured-by.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/secured-by.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('should remove securedBy', () => {
      const A = obj.resources[0];
      const get = A.methods[0];
      const post = A.methods[1];
      const put = A.methods[2];
      const del = A.methods[3];

      assert.strictEqual(get.securedBy, undefined);
      assert.strictEqual(post.securedBy, undefined);
      assert.strictEqual(put.securedBy, undefined);
      assert.strictEqual(del.securedBy, undefined);
    });

    it('should make securedBy consistent', () => {
      const B = obj.resources[1];

      assert.strictEqual(B.methods[0].securedBy.constructor, Array);
      assert.strictEqual(B.methods[0].securedBy.length, 1);
      assert.strictEqual(
        B.methods[0].securedBy[0],
        Object(B.methods[0].securedBy[0])
      );
      assert.strictEqual(B.methods[0].securedBy[0].schemeName, 'oauth_2_0');

      assert.strictEqual(B.methods[1].securedBy.constructor, Array);
      assert.strictEqual(B.methods[1].securedBy.length, 2);
      assert.strictEqual(
        B.methods[1].securedBy[0],
        Object(B.methods[1].securedBy[0])
      );
      assert.strictEqual(B.methods[1].securedBy[0].schemeName, 'oauth_2_0');
      assert.strictEqual(B.methods[1].securedBy[1], null);

      assert.strictEqual(B.methods[2].securedBy.constructor, Array);
      assert.strictEqual(B.methods[2].securedBy.length, 2);
      assert.strictEqual(
        B.methods[2].securedBy[0],
        Object(B.methods[2].securedBy[0])
      );
      assert.strictEqual(
        B.methods[2].securedBy[0].schemeName,
        'oauth_2_0_withscopes'
      );
      assert.strictEqual(B.methods[2].securedBy[0].scopes.constructor, Array);
      assert.strictEqual(B.methods[2].securedBy[0].scopes.length, 1);
      assert.strictEqual(B.methods[2].securedBy[0].scopes[0], 'remove-b');
      assert.strictEqual(B.methods[2].securedBy[1], null);

      const C = obj.resources[2];

      assert.strictEqual(C.methods[0].securedBy.constructor, Array);
      assert.strictEqual(C.methods[0].securedBy.length, 2);
      assert.strictEqual(
        C.methods[0].securedBy[0],
        Object(C.methods[0].securedBy[0])
      );
      assert.strictEqual(
        C.methods[0].securedBy[0].schemeName,
        'oauth_2_0_withscopes'
      );
      assert.strictEqual(C.methods[0].securedBy[0].scopes.constructor, Array);
      assert.strictEqual(C.methods[0].securedBy[0].scopes.length, 1);
      assert.strictEqual(C.methods[0].securedBy[0].scopes[0], 'read-c');
      assert.strictEqual(
        C.methods[0].securedBy[1],
        Object(C.methods[0].securedBy[1])
      );
      assert.strictEqual(C.methods[0].securedBy[1].schemeName, 'custom_scheme');
    });
  });
});
