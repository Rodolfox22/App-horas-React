const fs = require('fs');
const packageJson = require('./package.json');

const versionData = {
  version: packageJson.version,
  buildDate: new Date().toISOString(),
  homepage: packageJson.homepage
};

fs.writeFileSync('./public/version.json', JSON.stringify(versionData, null, 2));