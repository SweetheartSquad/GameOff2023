import { Axes, Buttons, Gamepads } from 'input-gamepads.js';
import { Sprite, Texture } from 'pixi.js';
import { resizer } from '.';
import { game } from './Game';
import { GameScene } from './GameScene';
import { fps, size } from './config';
import { KEYS, keys } from './input-keys';
import { Mouse } from './input-mouse';
import { swipes } from './input-swipe';
import { clamp } from './utils';

const gamepads = new Gamepads();
// eslint-disable-next-line import/no-mutable-exports
export let mouse: Mouse;
let activeScene: GameScene | undefined;
let newScene: GameScene | (() => GameScene) | undefined;

export function getActiveScene(): GameScene | undefined {
	return activeScene;
}

export function setScene(scene?: NonNullable<typeof newScene>): void {
	newScene = scene;
}

export function getInput() {
	const res = {
		look: {
			x: gamepads.getAxis(Axes.RSTICK_H) * 2,
			y: gamepads.getAxis(Axes.RSTICK_V) * 2,
		},
		move: {
			x: gamepads.getAxis(Axes.LSTICK_H),
			y: gamepads.getAxis(Axes.LSTICK_V),
		},
		justMoved: {
			x:
				(gamepads.axisJustPast(Axes.LSTICK_H, 0.5, 1) && 1) ||
				(gamepads.axisJustPast(Axes.LSTICK_H, -0.5, -1) && -1) ||
				0,
			y:
				(gamepads.axisJustPast(Axes.LSTICK_V, 0.5, 1) && 1) ||
				(gamepads.axisJustPast(Axes.LSTICK_V, -0.5, -1) && -1) ||
				0,
		},
		choiceLeft: false,
		choiceRight: false,
		choiceUp: false,
		choiceDown: false,
		choiceAny: false,
		interact:
			gamepads.isJustDown(Buttons.A) ||
			gamepads.isJustDown(Buttons.B) ||
			gamepads.isJustDown(Buttons.X) ||
			gamepads.isJustDown(Buttons.Y) ||
			keys.isJustDown(KEYS.SPACE) ||
			keys.isJustDown(KEYS.E) ||
			keys.isJustDown(KEYS.Z) ||
			keys.isJustDown(KEYS.X) ||
			keys.isJustDown(KEYS.C) ||
			keys.isJustDown(KEYS.ENTER),
		menu:
			keys.isJustDown(KEYS.ESCAPE) ||
			gamepads.isJustDown(Buttons.START) ||
			gamepads.isJustDown(Buttons.BACK),
	};

	if (
		keys.isDown(KEYS.A) ||
		keys.isDown(KEYS.LEFT) ||
		gamepads.isDown(Buttons.DPAD_LEFT)
	) {
		res.move.x -= 1;
		if (
			keys.isJustDown(KEYS.A) ||
			keys.isJustDown(KEYS.LEFT) ||
			gamepads.isJustDown(Buttons.DPAD_LEFT)
		) {
			res.justMoved.x = -1;
		}
	}
	if (
		keys.isDown(KEYS.D) ||
		keys.isDown(KEYS.RIGHT) ||
		gamepads.isDown(Buttons.DPAD_RIGHT)
	) {
		res.move.x += 1;
		if (
			keys.isJustDown(KEYS.D) ||
			keys.isJustDown(KEYS.RIGHT) ||
			gamepads.isJustDown(Buttons.DPAD_RIGHT)
		) {
			res.justMoved.x = 1;
		}
	}
	if (
		keys.isDown(KEYS.W) ||
		keys.isDown(KEYS.UP) ||
		gamepads.isDown(Buttons.DPAD_UP)
	) {
		res.move.y -= 1;
		if (
			keys.isJustDown(KEYS.W) ||
			keys.isJustDown(KEYS.UP) ||
			gamepads.isJustDown(Buttons.DPAD_UP)
		) {
			res.justMoved.y = -1;
		}
	}
	if (
		keys.isDown(KEYS.S) ||
		keys.isDown(KEYS.DOWN) ||
		gamepads.isDown(Buttons.DPAD_DOWN)
	) {
		res.move.y += 1;
		if (
			keys.isJustDown(KEYS.S) ||
			keys.isJustDown(KEYS.DOWN) ||
			gamepads.isJustDown(Buttons.DPAD_DOWN)
		) {
			res.justMoved.y = 1;
		}
	}

	if (Math.abs(mouse.delta.x) > 1) {
		res.look.x +=
			(mouse.delta.x / Math.max(size.x, size.y) / resizer.scaleMultiplier) * 80;
	}
	if (Math.abs(mouse.delta.y) > 1) {
		res.look.y +=
			(mouse.delta.y / Math.max(size.x, size.y) / resizer.scaleMultiplier) * 80;
	}

	res.move.x = clamp(-1.0, res.move.x, 1.0);
	res.move.y = clamp(-1.0, res.move.y, 1.0);

	if (
		res.justMoved.x < 0 ||
		gamepads.isJustDown(Buttons.X) ||
		swipes.isLeft()
	) {
		res.choiceLeft = true;
	} else if (
		res.justMoved.x > 0 ||
		gamepads.isJustDown(Buttons.B) ||
		swipes.isRight()
	) {
		res.choiceRight = true;
	} else if (
		res.justMoved.y < 0 ||
		gamepads.isJustDown(Buttons.Y) ||
		swipes.isUp()
	) {
		res.choiceUp = true;
	} else if (
		res.justMoved.y > 0 ||
		gamepads.isJustDown(Buttons.A) ||
		swipes.isDown()
	) {
		res.choiceDown = true;
	} else if (swipes.press) {
		res.interact = true;
	}
	res.choiceAny =
		res.choiceLeft || res.choiceRight || res.choiceUp || res.choiceDown;

	return res;
}

function update(): void {
	// switch scene
	if (newScene && activeScene !== newScene) {
		activeScene?.destroy();
		window.scene = activeScene =
			typeof newScene === 'function' ? newScene() : newScene;
		newScene = undefined;
		if (activeScene) {
			game.app.stage.addChildAt(activeScene.camera.display.container, 1);
		}
	}

	// update
	activeScene?.update();

	// update input managers
	gamepads.update();
	keys.update();
	mouse.update();
	swipes.update();
}

export function init(): void {
	// initialize input managers
	keys.init({
		capture: [
			KEYS.LEFT,
			KEYS.RIGHT,
			KEYS.UP,
			KEYS.DOWN,
			KEYS.SPACE,
			KEYS.ENTER,
		],
	});
	// TODO: remove unsafe cast https://github.com/pixijs/pixijs/pull/8820
	mouse = new Mouse(game.app.view as unknown as HTMLCanvasElement, true);

	const fill = new Sprite(Texture.WHITE);
	fill.name = 'fill';
	fill.tint = 0x000000;
	fill.width = size.x;
	fill.height = size.x;
	game.app.stage.addChildAt(fill, 0);
	setScene(new GameScene());

	// start main loop
	game.app.ticker.maxFPS = fps;
	game.app.ticker.add(update);
	game.app.ticker.update();
}
