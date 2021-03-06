class Game {

	static KEY_CODES = {
		LEFT: 'ArrowLeft',
		RIGHT: 'ArrowRight',
		UP: 'ArrowUp',
		DOWN: 'ArrowDown',
		J: 'j',
		K: 'k',
		L: 'l',
		D: 'd',
		G: 'g',
		R: 'r',
		F: 'f',
		Q: 'q',
		W: 'w',
		E: 'e',
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
			Game.KEY_CODES.J,
			Game.KEY_CODES.K,
			Game.KEY_CODES.L,
			Game.KEY_CODES.D,
			Game.KEY_CODES.G,
			Game.KEY_CODES.R,
			Game.KEY_CODES.F,
			Game.KEY_CODES.Q,
			Game.KEY_CODES.W,
			Game.KEY_CODES.E,
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
					[Player.CONTROL_ACTIONS.GO_LEFT]: Game.KEY_CODES.J,
					[Player.CONTROL_ACTIONS.GO_RIGHT]: Game.KEY_CODES.K,
					[Player.CONTROL_ACTIONS.SHOOT]: Game.KEY_CODES.L,
				}, 5),
				new Player(this, 150, 575, Math.PI * 1.5, {
					[Player.CONTROL_ACTIONS.TURN_LEFT]: Game.KEY_CODES.D,
					[Player.CONTROL_ACTIONS.TURN_RIGHT]: Game.KEY_CODES.G,
					[Player.CONTROL_ACTIONS.GO_FORWARD]: Game.KEY_CODES.R,
					[Player.CONTROL_ACTIONS.GO_BACKWARD]: Game.KEY_CODES.F,
					[Player.CONTROL_ACTIONS.GO_LEFT]: Game.KEY_CODES.Q,
					[Player.CONTROL_ACTIONS.GO_RIGHT]: Game.KEY_CODES.W,
					[Player.CONTROL_ACTIONS.SHOOT]: Game.KEY_CODES.E,
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
