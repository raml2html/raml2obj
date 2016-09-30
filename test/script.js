const raml2obj = require('..');

raml2obj.parse('./world-music-api/api.raml').then((result) => {
  const jsonString = JSON.stringify(result, null, 4);
  console.log(jsonString);
});
