'use strict';

const fs = require('fs');
const raml2obj = require('..');
const glob = require('glob');

process.chdir(__dirname);

const ramlFiles = glob
  .sync('*.raml')
  .filter(
    ramlFile =>
      ramlFile !== 'zeropointeight.raml' && ramlFile !== 'outofmemory.raml'
  );

ramlFiles.forEach(ramlFile => {
  console.log(ramlFile);
  raml2obj.parse(ramlFile).then(
    result => {
      const jsonString = JSON.stringify(result, null, 4);
      const filename = ramlFile.replace('.raml', '.json');
      fs.writeFileSync(filename, jsonString);
    },
    error => {
      console.log(ramlFile, error);
    }
  );
});
