/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('helloworld.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/helloworld.raml').then(
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
      assert.strictEqual(obj.title, 'Hello world');
      assert.strictEqual(obj.version, '1');
      assert.strictEqual(obj.baseUri, 'http://example.com/{version}');
      assert.strictEqual(obj.resources.length, 1);
    });

    it('should test the documentation', () => {
      assert.strictEqual(obj.documentation.length, 2);

      const first = obj.documentation[0];
      const second = obj.documentation[1];

      assert.strictEqual(first.title, 'Welcome');
      assert.strictEqual(
        first.content,
        'Welcome to the Example Documentation. The Example API allows you\nto do stuff. See also [example.com](https://www.example.com).\n'
      );
      assert.strictEqual(first.uniqueId, 'welcome');

      assert.strictEqual(second.title, 'Chapter two');
      assert.strictEqual(
        second.content,
        'More content here. Including **bold** text!\n'
      );
      assert.strictEqual(second.uniqueId, 'chapter_two');
    });

    it('should test the top level /helloworld resource', () => {
      const resource = obj.resources[0];

      assert.strictEqual(resource.relativeUri, '/helloworld');
      assert.strictEqual(resource.displayName, '/helloworld');
      assert.strictEqual(
        resource.description,
        'This is the top level description for /helloworld.'
      );
      assert.strictEqual(resource.parentUrl, '');
      assert.strictEqual(resource.uniqueId, 'helloworld');
      assert.deepEqual(resource.allUriParameters, []);
    });

    it('should test the /helloworld methods', () => {
      const methods = obj.resources[0].methods;

      assert.strictEqual(methods.length, 1);

      const method = methods[0];

      assert.strictEqual(method.method, 'get');
      assert.deepEqual(method.allUriParameters, []);
      assert.deepEqual(method.responses.length, 1);

      const response = method.responses[0];

      assert.strictEqual(response.code, '200');
      assert.strictEqual(response.body.length, 1);
      assert.strictEqual(response.body[0].name, 'application/json');
      assert.strictEqual(response.body[0].displayName, 'application/json');
      assert.strictEqual(
        response.body[0].type,
        '{\n  "title": "Hello world Response",\n  "type": "object",\n  "properties": {\n    "message": {\n      "type": "string"\n    }\n  }\n}\n'
      );
      assert.strictEqual(
        response.body[0].examples[0].value,
        '{\n  "message": "Hello world"\n}'
      );
    });

    it('should test the sub-resource', () => {
      const topTesource = obj.resources[0];
      assert.strictEqual(topTesource.resources.length, 1);

      const resource = obj.resources[0].resources[0];
      assert.strictEqual(resource.relativeUri, '/test');
      assert.strictEqual(resource.displayName, 'TEST');
      assert.strictEqual(resource.parentUrl, '/helloworld');
      assert.strictEqual(resource.uniqueId, 'helloworld_test');
      assert.deepEqual(resource.allUriParameters, []);
    });
  });
});
