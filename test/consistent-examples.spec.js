/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('consistent-examples.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/consistent-examples.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('all examples should have consistent representations', () => {
      let parent;
      let example;
      let value;

      assert.strictEqual(obj.resources[0].relativeUri, '/FullExamples');
      parent = obj.resources[0].methods[0].responses[0].body[0];
      example = parent.examples[0];

      assert.strictEqual(example.displayName, 'First Example!');
      assert.strictEqual(example.description, "It's the first example");
      assert.strictEqual(JSON.parse(example.value).SomeField, 'Uno');

      example = parent.examples[1];

      assert.strictEqual(example.displayName, 'Second Example!');
      assert.strictEqual(example.description, "It's the second example");
      assert.strictEqual(JSON.parse(example.value).SomeField, 'Duo');

      assert.strictEqual(obj.resources[1].relativeUri, '/JsonExample');
      parent = obj.resources[1].methods[0].responses[0].body[0];
      example = parent.examples[0];
      value = JSON.parse(example.value);
      assert.strictEqual(value.TestField, 'This example is defined in JSON.');

      assert.strictEqual(obj.resources[2].relativeUri, '/HeaderExample');
      parent = obj.resources[2].methods[0];
      example = parent.headers[0].examples[0];
      assert.strictEqual(example.value, 'Very Important');

      example = parent.headers[1].examples[0];
      assert.strictEqual(example.displayName, 'Baloon Assertion');
      assert.strictEqual(
        example.description,
        'This descriptive header example'
      );
      assert.strictEqual(
        example.value,
        'Red baloons are known to be the colour red.'
      );

      assert.strictEqual(
        obj.resources[3].relativeUri,
        '/UriExample/{Id}/{Mood}'
      );
      parent = obj.resources[3];
      example = parent.uriParameters[0].examples[0];
      assert.strictEqual(example.value, 'ABC123');

      example = parent.uriParameters[1].examples[0];
      assert.strictEqual(example.displayName, 'How are ya');
      assert.strictEqual(example.description, 'ARE YOU ANGRY');
      assert.strictEqual(example.value, 'Serene.');

      assert.strictEqual(obj.resources[4].relativeUri, '/QueryParamsExample');
      parent = obj.resources[4].methods[0];
      example = parent.queryParameters[0].examples[0];
      assert.strictEqual(example.displayName, 'Comfortable');
      assert.strictEqual(example.description, 'Best combined with a sunny day');
      assert.strictEqual(example.value, '24');

      assert.strictEqual(obj.resources[5].relativeUri, '/NestedExample');
      parent = obj.resources[5].methods[0].responses[0].body[0];
      example = parent.properties[0].examples[0];
      value = JSON.parse(example.value);
      assert.strictEqual(example.displayName, 'Sneaky nested example');
      assert.strictEqual(example.description, "It's sneaky!");
      assert.strictEqual(value.HereIsANumber, 42);
      assert.strictEqual(value.HereIsAString, 'Strange strong string');

      example = parent.properties[1].examples[0];
      assert.strictEqual(example.value, "I'm layered, bro");
    });
  });
});
