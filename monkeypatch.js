const path = require('path');
const fs = require('fs');

const pathPixi3d = path.resolve(
	__dirname,
	'node_modules/pixi3d/dist/esm/pixi7/pixi3d.js'
);

let pixi3d = fs.readFileSync(pathPixi3d, { encoding: 'utf-8' });
pixi3d = pixi3d.replace(/float GAMMA = 2\.2/, 'float GAMMA = 1.0');
fs.writeFileSync(pathPixi3d, pixi3d, { encoding: 'utf-8' });
