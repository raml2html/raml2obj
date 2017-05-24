/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('resourceexample.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/resourceexample.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('should have examples from types when no examples in resource', () => {
      const method = obj.resources[0].methods[0];
      const response = method.responses[0];
      const examples = response.body[0].examples;
      assert.strictEqual(response.code, '200');
      assert.strictEqual(examples.length, 2);
      assert.deepEqual(examples[0].structuredValue, {
        content: 'typeExample1',
      });
      assert.deepEqual(examples[1].structuredValue, {
        content: 'typeExample2',
      });
    });

    it('should have examples from resources when given', () => {
      const method = obj.resources[0].methods[0];
      const response = method.responses[1];
      const examples = response.body[0].examples;
      assert.strictEqual(response.code, '202');
      assert.strictEqual(examples.length, 2);
      assert.deepEqual(examples[0].structuredValue, {
        content: 'resourceExample1',
      });
      assert.deepEqual(examples[1].structuredValue, {
        content: 'resourceExample2',
      });
    });
  });
});
