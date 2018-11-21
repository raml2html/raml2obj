/* eslint-env node, mocha */

'use strict';

const raml2obj = require('..');
const assert = require('assert');

describe('raml2obj', () => {
  describe('bug.raml', () => {
    let obj;

    before(done => {
      raml2obj.parse('test/bug/bug.raml').then(
        result => {
          obj = result;
          done();
        },
        error => {
          console.log('error', error);
        }
      );
    });

    it('should have analysis type', () => {
      assert.strictEqual(obj.types['types.Analysis'].name, 'Analysis');
    });

    it('should have analysis.sample property', () => {
      // assert.deepEqual(obj.types['types.Analysis'].properties[2], {
      //   name: 'samples',
      //   displayName: 'samples',
      //   typePropertyKind: 'TYPE_EXPRESSION',
      //   type: 'array',
      //   required: true,
      //   items: 'types.Sample',
      //   key: 'samples',
      // });

      assert.strictEqual(obj.types['types.Analysis'].properties[2].name, 'samples');

    });

    it('should have sample type', () => {
      assert.strictEqual(Object.keys(obj.types).length, 2);
      assert.strictEqual(obj.types['types.Sample'].name, 'Sample');
    });
  });
});
