class Game {

	static KEY_CODES = {
		LEFT: 'ArrowLeft',
		RIGHT: 'ArrowRight',
		UP: 'ArrowUp',
		DOWN: 'ArrowDown',
		A: 'a',
		D: 'd',
		W: 'w',
		S: 's',
	};

	constructor(document, canvasElement, width, height) {
		this.context = canvasElement.getContext('2d');
		this.width = width;
		this.height = height;
		canvasElement.width = this.width;
		canvasElement.height = this.height;

		this.listenKeys = [
			Game.KEY_CODES.LEFT,
			Game.KEY_CODES.RIGHT,
			Game.KEY_CODES.UP,
			Game.KEY_CODES.DOWN,
			Game.KEY_CODES.A,
			Game.KEY_CODES.D,
			Game.KEY_CODES.W,
			Game.KEY_CODES.S,
		];

		this.keysPressed = {};
		this.listenKeys.forEach(keyCode => this.keysPressed[keyCode] = false);

		this.playground = new Playground(
			this,
			this.width,
			this.height,
			[
				new Player(this, 200, 100, {
					[Player.CONTROL_ACTIONS.LEFT]: Game.KEY_CODES.LEFT,
					[Player.CONTROL_ACTIONS.RIGHT]: Game.KEY_CODES.RIGHT,
					[Player.CONTROL_ACTIONS.UP]: Game.KEY_CODES.UP,
					[Player.CONTROL_ACTIONS.DOWN]: Game.KEY_CODES.DOWN,
				}),
				new Player(this, 260, 60, {
					[Player.CONTROL_ACTIONS.LEFT]: Game.KEY_CODES.A,
					[Player.CONTROL_ACTIONS.RIGHT]: Game.KEY_CODES.D,
					[Player.CONTROL_ACTIONS.UP]: Game.KEY_CODES.W,
					[Player.CONTROL_ACTIONS.DOWN]: Game.KEY_CODES.S,
				}),
			],
			[
				new Wall(150, 300, 100, 200),
				new Wall(400, 400, 100, 50),
				new Wall(250, 400, 130, 100),
				new Wall(480, 350, 20, 50),
				new Wall(350, 150, 40, 200),
			],
		);

		document.addEventListener('keydown', (event) => {
			this.onKeyPress(event.key, true);
		});
		document.addEventListener('keyup', (event) => {
			this.onKeyPress(event.key, false);
		});
	}

	render() {
		this.playground.render(this.context);

		window.requestAnimationFrame(this.render.bind(this));
	}

	onKeyPress(keyCode, wasPressed) {
		for (let i = 0; i < this.listenKeys.length; i++) {
			if (keyCode === this.listenKeys[i]) {
				this.keysPressed[keyCode] = wasPressed;
				break;
			}
		}
	}

}
