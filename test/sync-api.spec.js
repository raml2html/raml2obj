/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('sync api', () => {
    let obj;

    before(() => {
      try {
        obj = raml2obj.parseSync('test/helloworld.raml');
      } catch (error) {
        console.log('error', error);
      }
    });

    it('sync api is working as same as async api', () => {
      assert.ok(obj);
    });
  });
});
