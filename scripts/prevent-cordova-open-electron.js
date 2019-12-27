const toRemove = `module.exports.run = (args) => {`;
const file = `./platforms/electron/cordova/lib/run.js`;

const { readFileSync, writeFileSync } = require('fs');

let data = readFileSync(file, 'utf-8');

data = data.replace(toRemove, toRemove + `return;`);

writeFileSync(file, data, 'utf-8');
