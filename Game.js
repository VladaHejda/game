class Game {

	static KEY_CODES = {
		LEFT: 'ArrowLeft',
		RIGHT: 'ArrowRight',
		UP: 'ArrowUp',
		DOWN: 'ArrowDown',
		C: 'c',
		V: 'v',
		SPACE: ' ',
		F: 'f',
		H: 'h',
		T: 't',
		G: 'g',
		A: 'a',
		S: 's',
		D: 'd',
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
			Game.KEY_CODES.C,
			Game.KEY_CODES.V,
			Game.KEY_CODES.SPACE,
			Game.KEY_CODES.F,
			Game.KEY_CODES.H,
			Game.KEY_CODES.T,
			Game.KEY_CODES.G,
			Game.KEY_CODES.A,
			Game.KEY_CODES.S,
			Game.KEY_CODES.D,
		];

		this.keysPressed = {};
		this.listenKeys.forEach(keyCode => this.keysPressed[keyCode] = false);

		this.playground = new Playground(
			this.width,
			this.height,
			[
				new Player(this, 260, 23, Math.PI * 1.5, {
					[Player.CONTROL_ACTIONS.TURN_LEFT]: Game.KEY_CODES.LEFT,
					[Player.CONTROL_ACTIONS.TURN_RIGHT]: Game.KEY_CODES.RIGHT,
					[Player.CONTROL_ACTIONS.GO_FORWARD]: Game.KEY_CODES.UP,
					[Player.CONTROL_ACTIONS.GO_BACKWARD]: Game.KEY_CODES.DOWN,
					[Player.CONTROL_ACTIONS.GO_LEFT]: Game.KEY_CODES.C,
					[Player.CONTROL_ACTIONS.GO_RIGHT]: Game.KEY_CODES.V,
					[Player.CONTROL_ACTIONS.SHOOT]: Game.KEY_CODES.SPACE,
				}, 5),
				new Player(this, 150, 575, Math.PI * 1.5, {
					[Player.CONTROL_ACTIONS.TURN_LEFT]: Game.KEY_CODES.F,
					[Player.CONTROL_ACTIONS.TURN_RIGHT]: Game.KEY_CODES.H,
					[Player.CONTROL_ACTIONS.GO_FORWARD]: Game.KEY_CODES.T,
					[Player.CONTROL_ACTIONS.GO_BACKWARD]: Game.KEY_CODES.G,
					[Player.CONTROL_ACTIONS.GO_LEFT]: Game.KEY_CODES.A,
					[Player.CONTROL_ACTIONS.GO_RIGHT]: Game.KEY_CODES.S,
					[Player.CONTROL_ACTIONS.SHOOT]: Game.KEY_CODES.D,
				}, 5),
			],
			new Ball(420, 300),
			[
				new Wall(50, 50, 20, 420),
				new Wall(120, 50, 420, 20),
				new Wall(520, 120, 20, 430),
				new Wall(50, 530, 420, 20),
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
