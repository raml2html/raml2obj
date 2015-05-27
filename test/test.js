'use strict';

var raml2obj = require('..');

raml2obj.parse('example.raml').then(function(ramlObj) {
  console.log(ramlObj);
}, function(error) {
  console.log('error:', error);
});
