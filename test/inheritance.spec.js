/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('inheritance.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/inheritance.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should test the basic properties of the raml object', () => {
      assert.equal(obj.title, 'Inheritance Test');
      assert.equal(obj.resources.length, 1);
    });

    it('should test type inheritance', () => {
      const properties = obj.resources[0].methods[0].body[0].properties;

      assert.equal(properties.length, 4);
      assert.equal(properties[0].displayName, 'name');
      assert.equal(properties[0].type, 'string');

      assert.equal(properties[1].displayName, 'email');
      assert.equal(properties[1].type, 'string');
      assert.equal(properties[1].pattern, '^.+@.+\\..+$');

      assert.equal(properties[2].displayName, 'gender');
      assert.equal(properties[2].type, 'string');
      assert.equal(properties[2].enum.length, 2);

      assert.equal(properties[3].displayName, 'password');
      assert.equal(properties[3].type, 'string');
    });
  });
});
