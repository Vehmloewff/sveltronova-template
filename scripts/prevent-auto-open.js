const { readFileSync, writeFileSync } = require('fs');

const path = `./platforms/browser/cordova/lib/run.js`;

let data = readFileSync(path, 'utf-8');

data = data.replace(
	`return server.launchBrowser({ 'target': args.target, 'url': projectUrl });`,
	`return server;`
);

writeFileSync(path, data, 'utf-8');
