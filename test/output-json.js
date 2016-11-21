const fs = require('fs');
const raml2obj = require('..');
const glob = require('glob');

process.chdir(__dirname);

const ramlFiles = glob.sync('*.raml').filter(ramlFile => ramlFile !== 'zeropointeight.raml');

ramlFiles.forEach((ramlFile) => {
  raml2obj.parse(ramlFile).then((result) => {
    console.log(ramlFile);
    const jsonString = JSON.stringify(result, null, 4);
    const filename = ramlFile.replace('.raml', '.json');
    fs.writeFileSync(filename, jsonString);
  }, (error) => {
    console.log(error);
  });
});
