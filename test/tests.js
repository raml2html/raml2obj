/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('helloworld-10.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/helloworld-10.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should test the basic properties of the resource', () => {
      assert.equal(obj.title, 'Hello world');
      assert.equal(obj.version, '1');
      assert.equal(obj.baseUri, 'http://example.com/1');
      assert.equal(obj.resources.length, 1);

      const resource = obj.resources[0];

      assert.equal(resource.relativeUri, '/helloworld');
      assert.equal(resource.displayName, '/helloworld');
      assert.equal(resource.parentUrl, '');
      assert.equal(resource.uniqueId, 'helloworld');
      assert.deepEqual(resource.allUriParameters, []);
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

    it('should test the methods', () => {
      const methods = obj.resources[0].methods;

      assert.equal(methods.length, 1);

      const method = methods[0];

      assert.equal(method.method, 'get');
      assert.deepEqual(method.allUriParameters, []);
      assert.deepEqual(Object.keys(method.responses), [200]);

      const twohundred = method.responses[200];

      assert.equal(twohundred.code, '200');
      assert.equal(twohundred.body['application/json'].name, 'application/json');
      assert.equal(twohundred.body['application/json'].displayName, 'application/json');
      assert.equal(twohundred.body['application/json'].required, true);
      assert.equal(twohundred.body['application/json'].type, '{\n  "title": "Hello world Response",\n  "type": "object",\n  "properties": {\n    "message": {\n      "type": "string"\n    }\n  }\n}\n');
      assert.deepEqual(twohundred.body['application/json'].example, { message: 'Hello world' });
    });
  });

  describe('helloworld-08.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/helloworld-08.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should test the basic properties of the resource', () => {
      assert.equal(obj.title, 'Hello world');
      assert.equal(obj.version, '1');
      assert.equal(obj.baseUri, 'http://example.com/1');
      assert.equal(obj.resources.length, 1);

      const resource = obj.resources[0];

      assert.equal(resource.relativeUri, '/helloworld');
      assert.equal(resource.displayName, '/helloworld');
      assert.equal(resource.parentUrl, '');
      assert.equal(resource.uniqueId, 'helloworld');
      assert.deepEqual(resource.allUriParameters, []);
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

    it('should test the methods', () => {
      const methods = obj.resources[0].methods;

      assert.equal(methods.length, 1);

      const method = methods[0];

      assert.equal(method.method, 'get');
      assert.deepEqual(method.allUriParameters, []);
      assert.deepEqual(Object.keys(method.responses), [200]);

      const twohundred = method.responses[200];

      assert.equal(twohundred.code, '200');
      assert.equal(twohundred.body['application/json'].name, 'application/json');

      // TODO: 0.8 is missing displayName, we need to make this consistent!
      // assert.equal(twohundred.body['application/json'].displayName, 'application/json');

      // TODO: 0.8 is doesn't default to required (it's missing), we need to make this consistent!
      // assert.equal(twohundred.body['application/json'].required, true);

      // TODO: 0.8 doesn't have "type" but "scheme". We need to make the output consistent!
      assert.equal(twohundred.body['application/json'].schema, '{\n  "title": "Hello world Response",\n  "type": "object",\n  "properties": {\n    "message": {\n      "type": "string"\n    }\n  }\n}\n');

      // TODO: in 0.8 we get a string back instead of an object. We need to make this consistent!
      assert.equal(twohundred.body['application/json'].example, '{\n  "message": "Hello world"\n}\n');
    });
  });
});
