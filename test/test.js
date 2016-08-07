'use strict';

const raml2obj = require('..');

raml2obj.parse('example.raml').then((ramlObj) => {
  console.log(ramlObj);
}, (error) => {
  console.log('error:', error);
});
