import { Cubemap } from 'pixi3d/pixi7';
import { tex } from './utils';

let cubemap: Cubemap;

export function getCubemap() {
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
