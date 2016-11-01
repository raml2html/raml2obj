/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('arrayitems.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/arrayitems.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should test the array items', () => {
      const body = obj.resources[0].methods[0].responses[0].body[0];
      assert.equal(body.type, 'array');
      assert.equal(body.items.displayName, 'Foo');
      assert.equal(body.items.required, true);
    });
  });
});
