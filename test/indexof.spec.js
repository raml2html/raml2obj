/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('indexof.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/indexof.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should test the basic properties of the raml object', () => {
      assert.equal(obj.title, 'Test');
      assert.equal(obj.resources.length, 1);
    });

    it('should test the GET /test method', () => {
      const GET = obj.resources[0].methods[0];
      const body = GET.body[0];
      assert.equal(body.type.displayName, 'type');
      assert.equal(body.type.properties[0].name, 'o1a');
    });
  });
});
