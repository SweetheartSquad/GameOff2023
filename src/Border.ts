import { Sprite } from 'pixi.js';
import { game, resources } from './Game';
import { GameObject } from './GameObject';
import { Display } from './Scripts/Display';
import { size } from './config';

export class Border extends GameObject {
	display: Display;

	constructor() {
		super();
		this.scripts.push((this.display = new Display(this)));
		const spr = new Sprite(resources.border.texture);
		this.display.container.addChild(spr);
		this.display.container.width = size.x;
		this.display.container.height = size.y;
	}

	init(): void {
		super.init();
		game.app.stage.addChild(this.display.container);
	}

	destroy(): void {
		game.app.stage.removeChild(this.display.container);
		super.destroy();
	}
}
