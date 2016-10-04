/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('parameters.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/parameters.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should test the basic properties of the raml object', () => {
      assert.equal(obj.title, 'Lots of parameters');
      assert.equal(obj.resources.length, 1);
    });

    it('should test the /account resource', () => {
      const resource = obj.resources[0];

      assert.equal(resource.relativeUri, '/account');
      assert.equal(resource.displayName, '/account');
      assert.equal(resource.parentUrl, '');
      assert.equal(resource.allUriParameters.length, 0);
      assert.equal(resource.methods.length, 1);

      const method = resource.methods[0];

      assert.equal(method.allUriParameters.length, 0);
      assert.equal(method.method, 'post');
      assert.equal(method.body.length, 1);
      assert.equal(method.body[0].name, 'application/json');
      assert.deepEqual(method.body[0].type, ['object']);
      assert.equal(method.body[0].examples[0], '{\n  "email": "john@example.com",\n  "password": "super_secret",\n  "name": "John Doe"\n}');
      assert.equal(method.body[0].required, true);
      assert.equal(method.responses.length, 1);
      assert.equal(method.responses[0].code, '200');
      assert.equal(method.responses[0].description, 'Account was created and user is now logged in');
    });

    it('should test the /account/find resource', () => {
      const resource = obj.resources[0].resources[0];

      assert.equal(resource.relativeUri, '/find');
      assert.equal(resource.displayName, '/find');
      assert.equal(resource.parentUrl, '/account');
      assert.deepEqual(resource.allUriParameters, []);
      assert.equal(resource.methods.length, 1);

      const method = resource.methods[0];

      assert.equal(method.allUriParameters.length, 0);
      assert.equal(method.method, 'get');

      assert.equal(method.queryParameters.length, 3);
      assert.equal(method.queryParameters[0].name, 'name');
      assert.equal(method.queryParameters[0].displayName, 'name');
      assert.deepEqual(method.queryParameters[0].type, ['string']);
      assert.equal(method.queryParameters[0].examples[0], 'Naruto Uzumaki');
      assert.equal(method.queryParameters[0].required, true);
      assert.equal(method.queryParameters[0].description, 'name on account');

      assert.equal(method.queryParameters[1].name, 'gender');
      assert.equal(method.queryParameters[1].displayName, 'gender');
      assert.deepEqual(method.queryParameters[1].type, ['string']);
      assert.equal(method.queryParameters[1].required, true);
      assert.deepEqual(method.queryParameters[1].enum, ['male', 'female']);

      assert.equal(method.queryParameters[2].name, 'number');
      assert.equal(method.queryParameters[2].displayName, 'number');
      assert.deepEqual(method.queryParameters[2].type, ['integer']);
      assert.equal(method.queryParameters[2].required, true);
      assert.equal(method.queryParameters[2].default, 42);
    });

    it('should test the /account/{id} resource', () => {
      const resource = obj.resources[0].resources[1];

      assert.equal(resource.relativeUri, '/{id}');
      assert.equal(resource.displayName, '/{id}');
      assert.equal(resource.parentUrl, '/account');
      assert.equal(resource.methods.length, 3);

      assert.equal(resource.uriParameters.length, 1);
      assert.equal(resource.uriParameters[0].name, 'id');
      assert.equal(resource.uriParameters[0].displayName, 'id');
      assert.deepEqual(resource.uriParameters[0].type, ['string']);
      assert.equal(resource.uriParameters[0].required, true);
      assert.equal(resource.uriParameters[0].description, 'account identifier');
      assert.equal(resource.uriParameters[0].minLength, 1);
      assert.equal(resource.uriParameters[0].maxLength, 10);

      assert.deepEqual(resource.allUriParameters, resource.uriParameters);

      const get = resource.methods[0];

      assert.equal(get.method, 'get');
      assert.equal(get.allUriParameters.length, 1);
      assert.equal(get.allUriParameters[0].name, 'id');
      assert.equal(get.headers.length, 1);
      assert.equal(get.headers[0].name, 'Authorization');
      assert.equal(get.headers[0].displayName, 'Authorization');
      assert.deepEqual(get.headers[0].type, ['string']);
      assert.equal(get.headers[0].examples[0], 'Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==\n');
      assert.equal(get.headers[0].required, true);
      assert.equal(get.headers[0].description, 'Basic authentication header');

      const put = resource.methods[1];

      assert.equal(put.method, 'put');
      assert.equal(put.allUriParameters.length, 1);
      assert.equal(put.allUriParameters[0].name, 'id');
      assert.equal(put.body.length, 1);
      assert.equal(put.body[0].name, 'application/x-www-form-urlencoded');
      assert.deepEqual(put.body[0].type, ['object']);
      assert.equal(put.body[0].required, true);
      assert.equal(put.body[0].properties.length, 2);
      assert.equal(put.body[0].properties[0].name, 'name');
      assert.equal(put.body[0].properties[0].examples.length, 2);
      assert.equal(put.body[0].properties[0].examples[0], 'Naruto Uzumaki');
      assert.equal(put.body[0].properties[0].examples[1], 'Kevin Renskers');
      assert.equal(put.body[0].properties[1].name, 'gender');
    });

    it('should test the /account/{id}/{id} resource', () => {
      const resource = obj.resources[0].resources[1].resources[0];

      assert.equal(resource.relativeUri, '/{id}');
      assert.equal(resource.displayName, '/{id}');
      assert.equal(resource.parentUrl, '/account/{id}');

      assert.equal(resource.uriParameters.length, 1);
      assert.equal(resource.uriParameters[0].name, 'id');

      assert.equal(resource.allUriParameters.length, 2);
      assert.equal(resource.allUriParameters[0].name, 'id');
      assert.equal(resource.allUriParameters[1].name, 'id');

      const get = resource.methods[0];
      assert.equal(get.responses.length, 1);
      assert.equal(get.responses[0].headers.length, 1);
      assert.equal(get.responses[0].headers[0].name, 'WWW-Authenticate');
      assert.equal(get.responses[0].headers[0].description, 'user was not authorized');
    });
  });
});
