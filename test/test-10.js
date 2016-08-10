'use strict';

const raml2obj = require('..');

raml2obj.parse('example-10.raml').then((ramlObj) => {
  console.log(ramlObj);
}, (error) => {
  console.log('error:', error);
});
