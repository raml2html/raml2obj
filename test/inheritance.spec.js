/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('inheritance.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/inheritance.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('should test the basic properties of the raml object', () => {
      assert.strictEqual(obj.title, 'Inheritance Test');
      assert.strictEqual(obj.resources.length, 1);
    });

    it('should test type inheritance', () => {
      const properties = obj.resources[0].methods[0].body[0].properties;

      assert.strictEqual(properties.length, 4);
      assert.strictEqual(properties[0].displayName, 'name');
      assert.strictEqual(properties[0].type, 'string');

      assert.strictEqual(properties[1].displayName, 'email');
      assert.strictEqual(properties[1].type, 'string');
      assert.strictEqual(properties[1].pattern, '^.+@.+\\..+$');

      assert.strictEqual(properties[2].displayName, 'gender');
      assert.strictEqual(properties[2].type, 'string');
      assert.strictEqual(properties[2].enum.length, 2);

      assert.strictEqual(properties[3].displayName, 'password');
      assert.strictEqual(properties[3].type, 'string');
    });

    it('should test description of descendants', () => {
      const methods = obj.resources[0].methods;

      assert.strictEqual(
        methods[0].body[0].description,
        'An account which is password protected.'
      );
      assert.strictEqual(
        methods[1].body[0].description,
        'An account which is password protected.'
      );
    });
  });
});
