const path = require('path');
const fs = require('fs');

[
	'browser/pixi3d.js',
	'browser/pixi3d.min.js',
	'cjs/pixi7/pixi3d.js',
	'cjs/pixi7/pixi3d.min.js',
	'esm/pixi7/pixi3d.js',
	'esm/pixi7/pixi3d.min.js',
].forEach((p) => {
	const pathPixi3d = path.resolve(__dirname, 'node_modules/pixi3d/dist/', p);

	let pixi3d = fs.readFileSync(pathPixi3d, { encoding: 'utf-8' });
	pixi3d = pixi3d.replace(/float GAMMA\s*?=\s*?2\.2/, 'float GAMMA = 1.0');
	fs.writeFileSync(pathPixi3d, pixi3d, { encoding: 'utf-8' });
});
