import { SCALE_MODES } from 'pixi.js';
import { Cubemap } from 'pixi3d/pixi7';
import { tex } from './utils';

let cubemap: Cubemap;

export function getCubemap() {
	tex('skybox_posx').baseTexture.scaleMode = SCALE_MODES.LINEAR;
	tex('skybox_posy').baseTexture.scaleMode = SCALE_MODES.LINEAR;
	tex('skybox_posz').baseTexture.scaleMode = SCALE_MODES.LINEAR;
	tex('skybox_negx').baseTexture.scaleMode = SCALE_MODES.LINEAR;
	tex('skybox_negy').baseTexture.scaleMode = SCALE_MODES.LINEAR;
	tex('skybox_negz').baseTexture.scaleMode = SCALE_MODES.LINEAR;
	cubemap =
		cubemap ||
		Cubemap.fromFaces({
			posx: tex('skybox_posx'),
			posy: tex('skybox_posy'),
			posz: tex('skybox_posz'),
			negx: tex('skybox_negx'),
			negy: tex('skybox_negy'),
			negz: tex('skybox_negz'),
		});
	return cubemap;
}
