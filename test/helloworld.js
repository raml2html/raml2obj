/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('helloworld.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/helloworld.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should test the basic properties of the raml object', () => {
      assert.equal(obj.title, 'Hello world');
      assert.equal(obj.version, '1');
      assert.equal(obj.baseUri, 'http://example.com/1');
      assert.equal(obj.resources.length, 1);
    });

    it('should test the documentation', () => {
      assert.equal(obj.documentation.length, 2);

      const first = obj.documentation[0];
      const second = obj.documentation[1];

      assert.equal(first.title, 'Welcome');
      assert.equal(first.content, 'Welcome to the Example Documentation. The Example API allows you\nto do stuff. See also [example.com](https://www.example.com).\n');
      assert.equal(first.uniqueId, 'welcome');

      assert.equal(second.title, 'Chapter two');
      assert.equal(second.content, 'More content here. Including **bold** text!\n');
      assert.equal(second.uniqueId, 'chapter_two');
    });

    it('should test the top level /helloworld resource', () => {
      const resource = obj.resources[0];

      assert.equal(resource.relativeUri, '/helloworld');
      assert.equal(resource.displayName, '/helloworld');
      assert.equal(resource.description, 'This is the top level description for /helloworld.');
      assert.equal(resource.parentUrl, '');
      assert.equal(resource.uniqueId, 'helloworld');
      assert.deepEqual(resource.allUriParameters, []);
    });

    it('should test the /helloworld methods', () => {
      const methods = obj.resources[0].methods;

      assert.equal(methods.length, 1);

      const method = methods[0];

      assert.equal(method.method, 'get');
      assert.deepEqual(method.allUriParameters, []);
      assert.deepEqual(method.responses.length, 1);

      const response = method.responses[0];

      assert.equal(response.code, '200');
      assert.equal(response.body.length, 1);
      assert.equal(response.body[0].name, 'application/json');
      assert.equal(response.body[0].displayName, 'application/json');
      assert.equal(response.body[0].required, true);
      assert.equal(response.body[0].type, '{\n  "title": "Hello world Response",\n  "type": "object",\n  "properties": {\n    "message": {\n      "type": "string"\n    }\n  }\n}\n');
      assert.deepEqual(response.body[0].example, { message: 'Hello world' });
    });

    it('should test the sub-resource', () => {
      const topTesource = obj.resources[0];
      assert.equal(topTesource.resources.length, 1);

      const resource = obj.resources[0].resources[0];
      assert.equal(resource.relativeUri, '/test');
      assert.equal(resource.displayName, 'TEST');
      assert.equal(resource.parentUrl, '/helloworld');
      assert.equal(resource.uniqueId, 'helloworld_test');
      assert.deepEqual(resource.allUriParameters, []);
    });
  });
});
