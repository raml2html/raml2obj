/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('worldmusic.raml', function() {
    this.timeout(10000);

    let obj;

    before(done => {
      raml2obj.parse('test/worldmusic.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log(JSON.stringify(error));
        }
      );
    });

    it('should test the basic properties of the raml object', () => {
      assert.strictEqual(obj.title, 'World Music API');
      assert.strictEqual(obj.version, 'v1');
      assert.strictEqual(
        obj.baseUri,
        'http://{environment}.musicapi.com/{version}'
      );
      assert.strictEqual(obj.resources.length, 3); // /api, /entry, /songs
    });

    it('should test baseUriParameters', () => {
      assert.strictEqual(obj.baseUriParameters.length, 2);

      assert.strictEqual(obj.baseUriParameters[0].name, 'environment');
      assert.strictEqual(obj.baseUriParameters[0].type, 'string');
      assert.strictEqual(obj.baseUriParameters[0].required, true);
      assert.deepEqual(obj.baseUriParameters[0].enum, [
        'stg',
        'dev',
        'test',
        'prod',
      ]);

      assert.strictEqual(obj.baseUriParameters[1].name, 'version');
      assert.strictEqual(obj.baseUriParameters[1].type, 'string');
      assert.strictEqual(obj.baseUriParameters[1].required, true);
      assert.deepEqual(obj.baseUriParameters[1].enum, ['v1']);
    });

    it('should test the documentation', () => {
      assert.strictEqual(obj.documentation.length, 2);

      const first = obj.documentation[0];
      const second = obj.documentation[1];

      assert.strictEqual(first.title, 'Getting Started');
      assert.strictEqual(
        first.content,
        'This is a getting started guide for the World Music API.\n'
      );
      assert.strictEqual(first.uniqueId, 'getting_started');

      assert.strictEqual(second.title, 'Legal');
      assert.strictEqual(second.content, 'See http://legal.musicapi.com');
      assert.strictEqual(second.uniqueId, 'legal');
    });

    it('should test the /api resource', () => {
      const resource = obj.resources[0];

      assert.strictEqual(resource.relativeUri, '/api');
      assert.strictEqual(resource.displayName, '/api');
      assert.strictEqual(resource.parentUrl, '');
      assert.strictEqual(resource.uniqueId, 'api');
      assert.deepEqual(resource.securedBy, [{ schemeName: 'custom_scheme' }]);
      assert.strictEqual(resource.allUriParameters.length, 0);
    });

    it('should test the /api methods', () => {
      const methods = obj.resources[0].methods;

      assert.strictEqual(methods.length, 2);

      const get = methods[0];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.allUriParameters.length, 0);
      assert.deepEqual(get.securedBy, [{ schemeName: 'custom_scheme' }]);

      assert.strictEqual(get.queryString.name, 'queryString');
      assert.strictEqual(get.queryString.type, 'object');
      assert.strictEqual(get.queryString.properties.length, 2);
      assert.strictEqual(get.queryString.properties[0].name, 'start');
      assert.strictEqual(get.queryString.properties[0].required, false);
      assert.strictEqual(get.queryString.properties[0].type, 'number');

      assert.strictEqual(get.queryString.properties[1].name, 'page-size');
      assert.strictEqual(get.queryString.properties[1].required, false);
      assert.strictEqual(get.queryString.properties[1].type, 'number');

      const post = methods[1];

      assert.strictEqual(post.method, 'post');
      assert.strictEqual(post.allUriParameters.length, 0);
      assert.deepEqual(post.securedBy, [{ schemeName: 'custom_scheme' }]);
      assert.strictEqual(post.body.length, 1);
      assert.strictEqual(post.body[0].name, 'RamlDataType');
      assert.strictEqual(post.body[0].key, 'application/json');
      assert.strictEqual(post.body[0].type, 'object');
      assert.strictEqual(post.body[0].properties.length, 14);
      assert.strictEqual(
        post.body[0].properties[4].examples[0].value,
        'very well made'
      );
    });

    it('should test the /entry resource', () => {
      const resource = obj.resources[1];

      assert.strictEqual(resource.relativeUri, '/entry');
      assert.strictEqual(resource.displayName, '/entry');
      assert.strictEqual(resource.parentUrl, '');
      assert.strictEqual(resource.uniqueId, 'entry');
      assert.strictEqual(resource.type, 'collection');
      assert.deepEqual(resource.securedBy, [{ schemeName: 'custom_scheme' }]);
      assert.strictEqual(resource.allUriParameters.length, 0);
    });

    it('should test the /entry methods', () => {
      const methods = obj.resources[1].methods;

      assert.strictEqual(methods.length, 2);

      const post = methods[0];

      assert.strictEqual(post.method, 'post');
      assert.strictEqual(post.allUriParameters.length, 0);
      assert.deepEqual(post.securedBy, [{ schemeName: 'custom_scheme' }]);
      assert.strictEqual(post.responses.length, 1);
      assert.strictEqual(post.responses[0].code, '200');
      assert.strictEqual(post.responses[0].body.length, 1);
      assert.strictEqual(post.responses[0].body[0].name, 'AnotherEntry');
      assert.strictEqual(post.responses[0].body[0].key, 'application/json');
      assert.strictEqual(post.responses[0].body[0].type, 'json');
      assert.strictEqual(
        post.responses[0].body[0].content.indexOf('{\n  "type": "array"'),
        0
      );

      const get = methods[1];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.description, 'returns a list of entry');
      assert.strictEqual(get.allUriParameters.length, 0);
      assert.deepEqual(get.securedBy, [{ schemeName: 'custom_scheme' }]);
      assert.strictEqual(get.responses.length, 1);
      assert.strictEqual(get.responses[0].code, '200');
      assert.strictEqual(get.responses[0].body.length, 1);
      assert.strictEqual(get.responses[0].body[0].name, 'application/json');
      assert.deepEqual(get.responses[0].body[0].schema, ['Entry']);
    });

    it('should test the /songs resource', () => {
      const resource = obj.resources[2];

      assert.strictEqual(resource.relativeUri, '/songs');
      assert.strictEqual(resource.displayName, 'Songs');
      assert.strictEqual(
        resource.description,
        'Access to all songs inside the music world library.'
      );
      assert.strictEqual(resource.parentUrl, '');
      assert.strictEqual(resource.uniqueId, 'songs');
      assert.deepEqual(resource.securedBy, [{ schemeName: 'custom_scheme' }]);
      assert.strictEqual(resource.allUriParameters.length, 0);
      assert.strictEqual(resource.annotations.length, 1);
      assert.strictEqual(resource.annotations[0].name, 'ready');
      assert.deepEqual(resource.is, ['secured']);
      assert.strictEqual(resource.resources.length, 1);
    });

    it('should test the /songs methods', () => {
      const methods = obj.resources[2].methods;

      assert.strictEqual(methods.length, 2);

      const get = methods[0];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.allUriParameters.length, 0);
      assert.deepEqual(get.securedBy, [{ schemeName: 'oauth_2_0' }, null]);

      assert.strictEqual(get.annotations.length, 1);
      assert.strictEqual(get.annotations[0].name, 'monitoringInterval');
      assert.strictEqual(get.annotations[0].structuredValue, 30);

      assert.strictEqual(get.queryParameters.length, 2);

      const post = methods[1];

      assert.strictEqual(post.method, 'post');
      assert.deepEqual(post.securedBy, [{ schemeName: 'custom_scheme' }]);
      assert.strictEqual(post.queryParameters.length, 1);
    });

    it('should test the /songs/{songId} resource', () => {
      const resource = obj.resources[2].resources[0];

      assert.strictEqual(resource.relativeUri, '/{songId}');
      assert.strictEqual(resource.displayName, '/{songId}');
      assert.strictEqual(resource.parentUrl, '/songs');
      assert.strictEqual(resource.uniqueId, 'songs__songid_');
      assert.deepEqual(resource.securedBy, [{ schemeName: 'custom_scheme' }]);
      assert.strictEqual(resource.allUriParameters.length, 1);
    });

    it('should test the /songs/{songId} methods', () => {
      const methods = obj.resources[2].resources[0].methods;

      assert.strictEqual(methods.length, 1);

      const get = methods[0];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.allUriParameters.length, 1);
      assert.strictEqual(get.annotations.length, 1);
      assert.strictEqual(get.responses.length, 1);
      assert.deepEqual(get.securedBy, [{ schemeName: 'custom_scheme' }]);

      assert.strictEqual(get.responses[0].body.length, 2);
      assert.strictEqual(get.responses[0].body[0].displayName, 'Song');
      assert.strictEqual(get.responses[0].body[0].key, 'application/json');
      assert.strictEqual(get.responses[0].body[0].examples.length, 2);
      assert.strictEqual(get.responses[0].body[0].type, 'object');

      assert.strictEqual(
        get.responses[0].body[1].type.indexOf(
          '<?xml version="1.0" encoding="UTF-8"?>'
        ),
        0
      );
    });
  });
});
