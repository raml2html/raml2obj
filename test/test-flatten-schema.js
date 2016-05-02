'use strict';

var raml2obj = require('..');

function testFlattenSchema(test) {
  test.expect(21);
  raml2obj.opts({ flattenSchema: true });
  raml2obj.parse('example.raml').then(function(ramlObj) {
    var flatSchema = ramlObj.resources[0].methods[0].body['application/json'].flatSchema;
    test.notEqual(flatSchema, null, 'Could not find flatSchema');
    assertFieldDesc(test, flatSchema, 'email', "The account's email address");
    assertFieldDesc(test, flatSchema, 'password', 'The password use to login');
    assertFieldDesc(test, flatSchema, 'name', 'The fullname of the user');
    assertFieldDesc(test, flatSchema, 'nicknames', 'A list of nicknames for the user');
    assertFieldDesc(test, flatSchema, 'nicknames[]', 'A nickname that the user goes by');
    assertFieldDesc(test, flatSchema, 'address', 'The home address of the user');
    assertFieldDesc(test, flatSchema, 'address.street_address', 'The street address where the user lives');
    assertFieldDesc(test, flatSchema, 'address.city', 'The city where the user lives');
    assertFieldDesc(test, flatSchema, 'address.state', 'The state where the user lives');
    assertFieldDesc(test, flatSchema, 'address.zipcode', 'The zipcode where the user lives');
    test.done();
  }, function(error) {
    console.log('error:', error);
    test.ok(false, error.message);
    test.done();
  });
}

function testFlattenSchemaNoOpt(test) {
  test.expect(1);
  raml2obj.opts({});
  raml2obj.parse('example.raml').then(function(ramlObj) {
    var flatSchema = ramlObj.resources[0].methods[0].body['application/json'].flatSchema;
    test.equal(flatSchema, null, 'Expected ramlObj to not have flatSchema');
    test.done();
  }, function(error) {
    console.log('error:', error);
    test.ok(false, error.message);
    test.done();
  });
}

function assertFieldDesc(test, props, field, desc) {
  var val = props[field];
  test.notEqual(val, null, 'Did not have field ' + field);
  test.equal(val.description, desc);
}

module.exports.testFlattenSchema = testFlattenSchema;
module.exports.testFlattenSchemaNoOpt = testFlattenSchemaNoOpt;
