class Game {

	static KEY_CODES = {
		LEFT: 'ArrowLeft',
		RIGHT: 'ArrowRight',
		UP: 'ArrowUp',
		DOWN: 'ArrowDown',
		N: 'n',
		M: 'm',
		SPACE: ' ',
		A: 'a',
		D: 'd',
		W: 'w',
		S: 's',
		Q: 'q',
		E: 'e',
		R: 'r',
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
			Game.KEY_CODES.N,
			Game.KEY_CODES.M,
			Game.KEY_CODES.SPACE,
			Game.KEY_CODES.A,
			Game.KEY_CODES.D,
			Game.KEY_CODES.W,
			Game.KEY_CODES.S,
			Game.KEY_CODES.Q,
			Game.KEY_CODES.E,
			Game.KEY_CODES.R,
		];

		this.keysPressed = {};
		this.listenKeys.forEach(keyCode => this.keysPressed[keyCode] = false);

		this.playground = new Playground(
			this.width,
			this.height,
			[
				new Player(this, 200, 100, {
					[Player.CONTROL_ACTIONS.TURN_LEFT]: Game.KEY_CODES.LEFT,
					[Player.CONTROL_ACTIONS.TURN_RIGHT]: Game.KEY_CODES.RIGHT,
					[Player.CONTROL_ACTIONS.GO_FORWARD]: Game.KEY_CODES.UP,
					[Player.CONTROL_ACTIONS.GO_BACKWARD]: Game.KEY_CODES.DOWN,
					[Player.CONTROL_ACTIONS.GO_LEFT]: Game.KEY_CODES.N,
					[Player.CONTROL_ACTIONS.GO_RIGHT]: Game.KEY_CODES.M,
					[Player.CONTROL_ACTIONS.SHOOT]: Game.KEY_CODES.SPACE,
				}),
				new Player(this, 260, 60, {
					[Player.CONTROL_ACTIONS.TURN_LEFT]: Game.KEY_CODES.A,
					[Player.CONTROL_ACTIONS.TURN_RIGHT]: Game.KEY_CODES.D,
					[Player.CONTROL_ACTIONS.GO_FORWARD]: Game.KEY_CODES.W,
					[Player.CONTROL_ACTIONS.GO_BACKWARD]: Game.KEY_CODES.S,
					[Player.CONTROL_ACTIONS.GO_LEFT]: Game.KEY_CODES.Q,
					[Player.CONTROL_ACTIONS.GO_RIGHT]: Game.KEY_CODES.E,
					[Player.CONTROL_ACTIONS.SHOOT]: Game.KEY_CODES.R,
				}),
			],
			new Ball(220, 200),
			[
				new Wall(150, 300, 100, 200),
				new Wall(405, 400, 95, 50),
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
