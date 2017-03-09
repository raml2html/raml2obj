/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('parameters.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/parameters.raml').then(
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
      assert.strictEqual(obj.title, 'Lots of parameters');
      assert.strictEqual(obj.resources.length, 1);
    });

    it('should test the /account resource', () => {
      const resource = obj.resources[0];

      assert.strictEqual(resource.relativeUri, '/account');
      assert.strictEqual(resource.displayName, '/account');
      assert.strictEqual(resource.parentUrl, '');
      assert.strictEqual(resource.allUriParameters.length, 0);
      assert.strictEqual(resource.methods.length, 1);

      const method = resource.methods[0];

      assert.strictEqual(method.allUriParameters.length, 0);
      assert.strictEqual(method.method, 'post');
      assert.strictEqual(method.body.length, 1);
      assert.strictEqual(method.body[0].name, 'application/json');
      assert.strictEqual(method.body[0].type, 'object');
      assert.strictEqual(
        method.body[0].examples[0].value,
        '{\n  "email": "john@example.com",\n  "password": "super_secret",\n  "name": "John Doe"\n}'
      );
      assert.strictEqual(method.responses.length, 1);
      assert.strictEqual(method.responses[0].code, '200');
      assert.strictEqual(
        method.responses[0].description,
        'Account was created and user is now logged in'
      );
    });

    it('should test the /account/find resource', () => {
      const resource = obj.resources[0].resources[0];

      assert.strictEqual(resource.relativeUri, '/find');
      assert.strictEqual(resource.displayName, '/find');
      assert.strictEqual(resource.parentUrl, '/account');
      assert.deepEqual(resource.allUriParameters, []);
      assert.strictEqual(resource.methods.length, 1);

      const method = resource.methods[0];

      assert.strictEqual(method.allUriParameters.length, 0);
      assert.strictEqual(method.method, 'get');

      assert.strictEqual(method.queryParameters.length, 3);
      assert.strictEqual(method.queryParameters[0].name, 'name');
      assert.strictEqual(method.queryParameters[0].displayName, 'name');
      assert.strictEqual(method.queryParameters[0].type, 'string');
      assert.strictEqual(
        method.queryParameters[0].examples[0].value,
        'Naruto Uzumaki'
      );
      assert.strictEqual(method.queryParameters[0].required, true);
      assert.strictEqual(
        method.queryParameters[0].description,
        'name on account'
      );

      assert.strictEqual(method.queryParameters[1].name, 'gender');
      assert.strictEqual(method.queryParameters[1].displayName, 'gender');
      assert.strictEqual(method.queryParameters[1].type, 'string');
      assert.strictEqual(method.queryParameters[1].required, true);
      assert.deepEqual(method.queryParameters[1].enum, ['male', 'female']);

      assert.strictEqual(method.queryParameters[2].name, 'number');
      assert.strictEqual(method.queryParameters[2].displayName, 'number');
      assert.strictEqual(method.queryParameters[2].type, 'integer');
      assert.strictEqual(method.queryParameters[2].required, true);
      assert.strictEqual(method.queryParameters[2].default, 42);
    });

    it('should test the /account/{id} resource', () => {
      const resource = obj.resources[0].resources[1];

      assert.strictEqual(resource.relativeUri, '/{id}');
      assert.strictEqual(resource.displayName, '/{id}');
      assert.strictEqual(resource.parentUrl, '/account');
      assert.strictEqual(resource.methods.length, 3);

      assert.strictEqual(resource.uriParameters.length, 1);
      assert.strictEqual(resource.uriParameters[0].name, 'id');
      assert.strictEqual(resource.uriParameters[0].displayName, 'id');
      assert.strictEqual(resource.uriParameters[0].type, 'string');
      assert.strictEqual(resource.uriParameters[0].required, true);
      assert.strictEqual(
        resource.uriParameters[0].description,
        'account identifier'
      );
      assert.strictEqual(resource.uriParameters[0].minLength, 1);
      assert.strictEqual(resource.uriParameters[0].maxLength, 10);

      assert.deepEqual(resource.allUriParameters, resource.uriParameters);

      const get = resource.methods[0];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.allUriParameters.length, 1);
      assert.strictEqual(get.allUriParameters[0].name, 'id');
      assert.strictEqual(get.headers.length, 1);
      assert.strictEqual(get.headers[0].name, 'Authorization');
      assert.strictEqual(get.headers[0].displayName, 'Authorization');
      assert.strictEqual(get.headers[0].type, 'string');
      assert.strictEqual(
        get.headers[0].examples[0].value,
        'Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==\n'
      );
      assert.strictEqual(get.headers[0].required, true);
      assert.strictEqual(
        get.headers[0].description,
        'Basic authentication header'
      );

      const put = resource.methods[1];

      assert.strictEqual(put.method, 'put');
      assert.strictEqual(put.allUriParameters.length, 1);
      assert.strictEqual(put.allUriParameters[0].name, 'id');
      assert.strictEqual(put.body.length, 1);
      assert.strictEqual(put.body[0].name, 'application/x-www-form-urlencoded');
      assert.strictEqual(put.body[0].type, 'object');
      assert.strictEqual(put.body[0].properties.length, 2);
      assert.strictEqual(put.body[0].properties[0].name, 'name');
      assert.strictEqual(put.body[0].properties[0].examples.length, 2);
      assert.strictEqual(
        put.body[0].properties[0].examples[0].value,
        'Naruto Uzumaki'
      );
      assert.strictEqual(
        put.body[0].properties[0].examples[1].value,
        'Kevin Renskers'
      );
      assert.strictEqual(put.body[0].properties[1].name, 'gender');
    });

    it('should test the /account/{id}/{id} resource', () => {
      const resource = obj.resources[0].resources[1].resources[0];

      assert.strictEqual(resource.relativeUri, '/{id}');
      assert.strictEqual(resource.displayName, '/{id}');
      assert.strictEqual(resource.parentUrl, '/account/{id}');

      assert.strictEqual(resource.uriParameters.length, 1);
      assert.strictEqual(resource.uriParameters[0].name, 'id');

      assert.strictEqual(resource.allUriParameters.length, 2);
      assert.strictEqual(resource.allUriParameters[0].name, 'id');
      assert.strictEqual(resource.allUriParameters[1].name, 'id');

      const get = resource.methods[0];
      assert.strictEqual(get.responses.length, 1);
      assert.strictEqual(get.responses[0].headers.length, 1);
      assert.strictEqual(get.responses[0].headers[0].name, 'WWW-Authenticate');
      assert.strictEqual(
        get.responses[0].headers[0].description,
        'user was not authorized'
      );
    });
  });
});
