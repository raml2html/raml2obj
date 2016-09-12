/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('worldmusic.raml', () => {
    let obj;

    before((done) => {
      raml2obj.parse('test/world-music-api/api.raml').then((result) => {
        obj = result;
        done();
      }, (error) => {
        console.log('error', error);
      });
    });

    it('should test the basic properties of the raml object', () => {
      assert.equal(obj.title, 'World Music API');
      assert.equal(obj.version, 'v1');
      assert.equal(obj.baseUri, 'http://{environment}.musicapi.com/{version}');
      assert.equal(obj.resources.length, 3); // /api, /entry, /songs
    });

    it('should test baseUriParameters', () => {
      assert.equal(obj.baseUriParameters.length, 2);

      assert.equal(obj.baseUriParameters[0].name, 'environment');
      assert.deepEqual(obj.baseUriParameters[0].type, ['string']);
      assert.equal(obj.baseUriParameters[0].required, true);
      assert.deepEqual(obj.baseUriParameters[0].enum, ['stg', 'dev', 'test', 'prod']);

      assert.equal(obj.baseUriParameters[1].name, 'version');
      assert.deepEqual(obj.baseUriParameters[1].type, ['string']);
      assert.equal(obj.baseUriParameters[1].required, true);
      assert.deepEqual(obj.baseUriParameters[1].enum, ['v1']);
    });

    it('should test the documentation', () => {
      assert.equal(obj.documentation.length, 2);

      const first = obj.documentation[0];
      const second = obj.documentation[1];

      assert.equal(first.title, 'Getting Started');
      assert.equal(first.content, 'This is a getting started guide for the World Music API.\n');
      assert.equal(first.uniqueId, 'getting_started');

      assert.equal(second.title, 'Legal');
      assert.equal(second.content, 'See http://legal.musicapi.com');
      assert.equal(second.uniqueId, 'legal');
    });

    it('should test the /api resource', () => {
      const resource = obj.resources[0];

      assert.equal(resource.relativeUri, '/api');
      assert.equal(resource.displayName, '/api');
      assert.equal(resource.parentUrl, '');
      assert.equal(resource.uniqueId, 'api');
      assert.equal(resource.allUriParameters.length, 0);
    });

    it('should test the /api methods', () => {
      const methods = obj.resources[0].methods;

      assert.equal(methods.length, 2);

      const get = methods[0];

      assert.equal(get.method, 'get');
      assert.equal(get.allUriParameters.length, 0);
      assert.deepEqual(get.securedBy, ['custom_scheme']);

      assert.equal(get.queryString.name, 'queryString');
      assert.deepEqual(get.queryString.type, ['object']);
      assert.equal(get.queryString.required, true);
      assert.equal(get.queryString.properties.length, 2);
      assert.equal(get.queryString.properties[0].name, 'start');
      assert.equal(get.queryString.properties[0].required, false);
      assert.deepEqual(get.queryString.properties[0].type, ['number']);

      assert.equal(get.queryString.properties[1].name, 'page-size');
      assert.equal(get.queryString.properties[1].required, false);
      assert.deepEqual(get.queryString.properties[1].type, ['number']);

      const post = methods[1];

      assert.equal(post.method, 'post');
      assert.equal(post.allUriParameters.length, 0);
      assert.deepEqual(post.securedBy, ['custom_scheme']);
      assert.equal(post.body.length, 1);
      assert.equal(post.body[0].name, 'application/json');
      assert.deepEqual(post.body[0].type, ['ApiLib.RamlDataType']);
      assert.equal(post.body[0].required, true);
    });
  });
});
