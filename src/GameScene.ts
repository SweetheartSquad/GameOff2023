import { Container, DisplayObject } from 'pixi.js';
import {
	Camera as Camera3D,
	Container3D,
	Cubemap,
	Mesh3D,
	Quat,
	Skybox,
} from 'pixi3d/pixi7';
import { Camera } from './Camera';
import { game, resource } from './Game';
import { GameObject } from './GameObject';
import { ScreenFilter } from './ScreenFilter';
import { Updater } from './Scripts/Updater';
import { StrandE } from './StrandE';
import { TweenManager } from './Tweens';
import { UIDialogue } from './UIDialogue';
import { UIPrompt } from './UIPrompt';
import { UIScrim } from './UIScrim';
import { distance2 } from './VMath';
import { DEBUG } from './debug';
import { getInput } from './main';
import { lerp, tex } from './utils';

function depthCompare(a: DisplayObject, b: DisplayObject): number {
	return a.y - b.y;
}

export class GameScene extends GameObject {
	container = new Container();

	container3d = new Container3D();

	camera = new Camera();

	camera3d: Camera3D;

	scrim: UIScrim;

	dialogue: UIDialogue;

	prompt: UIPrompt;

	strand: StrandE;

	pointDialogue: Mesh3D;

	screenFilter?: ScreenFilter;

	interactive = true;

	interactionRegions: {
		x: number;
		y: number;
		range: number;
		label: string;
		action: () => void;
	}[] = [];

	x = 0;

	y = 0;

	constructor() {
		super();
		this.strand = new StrandE({
			source: resource<string>('main-en') || '',
			renderer: {
				displayPassage: (passage) => {
					if (passage.title === 'close') {
						this.dialogue.close();
						return Promise.resolve();
					}
					const program = this.strand.execute(passage.program);
					if (this.strand.voice) {
						this.dialogue.voice = this.strand.voice;
						delete this.strand.voice;
					}
					const text: string[] = [];
					const actions: ((typeof program)[number] & {
						name: 'action';
					})['value'][] = [];
					program.forEach((node) => {
						switch (node.name) {
							case 'text':
								text.push(node.value);
								break;
							case 'action':
								actions.push(node.value);
								break;
							default:
								throw new Error('unrecognized node type');
						}
					});
					this.dialogue.say(
						text.join('').trim(),
						actions.map((i) => ({
							text: i.text,
							action: () => this.strand.eval(i.action),
						}))
					);
					return Promise.resolve();
				},
			},
		});
		this.strand.scene = this;
		this.strand.debug = DEBUG;
		this.dialogue = new UIDialogue(this.strand);
		this.prompt = new UIPrompt();
		this.scrim = new UIScrim();

		this.camera.display.container.addChild(this.container);

		this.pointDialogue = Mesh3D.createCube();
		this.pointDialogue.visible = false;

		this.camera3d = Camera3D.main;
		this.x = 0;
		this.y = -10;
		this.scripts.push(
			new Updater(this, () => {
				const input = getInput();
				this.x += -input.look.x;
				this.y += input.look.y;
				if (this.x < -150) {
					this.x = lerp(this.x, -150, 0.1);
				} else if (this.x > 150) {
					this.x = lerp(this.x, 150, 0.1);
				}
				if (this.y < -70) {
					this.y = lerp(this.y, -70, 0.1);
				} else if (this.y > 50) {
					this.y = lerp(this.y, 50, 0.1);
				}
				this.camera3d.rotationQuaternion.array = Quat.fromEuler(
					this.y,
					this.x + 180,
					0
				);
			})
		);
		this.scripts.push(
			new Updater(this, () => {
				const interaction =
					this.interactive &&
					this.interactionRegions.find(
						(i) => distance2({ x: this.x, y: this.y }, i) < i.range ** 2
					);
				if (interaction) {
					this.prompt.prompt(interaction.label, interaction.action);
				} else {
					this.prompt.prompt();
				}
			})
		);

		const skybox = new Skybox(
			Cubemap.fromFaces({
				posx: tex('skybox_posx'),
				posy: tex('skybox_posy'),
				posz: tex('skybox_posz'),
				negx: tex('skybox_negx'),
				negy: tex('skybox_negy'),
				negz: tex('skybox_negz'),
			})
		);
		this.container3d.addChild(skybox);
		this.container3d.addChild(this.pointDialogue);

		game.app.stage.addChild(this.container3d);
		game.app.stage.addChild(this.scrim.display.container);
		game.app.stage.addChild(this.dialogue.display.container);
		game.app.stage.addChild(this.prompt.display.container);

		this.strand.history.push('close');
		this.container3d.visible = false;
		this.strand.goto('start');
	}

	destroy(): void {
		this.container.destroy({
			children: true,
		});
		this.container3d.destroy({
			children: true,
		});
		this.dialogue.destroy();
		this.prompt.destroy();
		super.destroy();
	}

	update(): void {
		if (DEBUG) {
			if (
				this.dialogue.isOpen &&
				this.strand.currentPassage.title === 'debug menu' &&
				getInput().menu
			) {
				this.strand.goto('close');
			} else if (getInput().menu) {
				this.strand.goto('debug menu');
			}
		}

		const u = this.update;
		this.update = () => {};
		GameObject.update();
		this.update = u;
		super.update();
		TweenManager.update();
	}
}
