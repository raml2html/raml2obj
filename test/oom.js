const raml2obj = require('..');

raml2obj.parse('outofmemory.raml').then(
  () => {
    console.log('DONE');
  },
  error => {
    console.log('error', error);
  }
);
