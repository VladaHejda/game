class Player {

	static CONTROL_ACTIONS = {
		TURN_LEFT: 0,
		TURN_RIGHT: 1,
		GO_FORWARD: 2,
		GO_BACKWARD: 3,
		GO_LEFT: 4,
		GO_RIGHT: 5,
		SHOOT: 6,
	};

	static STRAIGHT_MOVEMENT_COEFFICIENT = 3;
	static DIAGONAL_MOVEMENT_COEFFICIENT = Math.sqrt(Math.pow(Player.STRAIGHT_MOVEMENT_COEFFICIENT, 2) / 2);

	static MAX_STRETCHED = 1.3;

	constructor(game, x, y, rotation, controls, lives) {
		this.game = game;
		this.controls = controls;

		this.image = new Image();

		this.coordinates = {
			x,
			y,
		};
		this.rotation = rotation % (2 * Math.PI);
		this.radius = 20;

		this.movementSpeed = 1;
		this.rotationSpeed = 1;

		this.lives = lives;
		this.ball = null;
		this.stretched = 0;
		this.fatigued = 0;
		this.holdTime = 0;
		this.injured = 0;
		this.injuredBy = null;
	}

	update(playground) {
		if (this.lives > 0) {
			this.updateRotation();
			this.updateMovement(playground);
			this.stretch();
		} else {
			this.holdTime = 0;
		}

		this.updateBall();

		if (this.fatigued > 0) {
			this.fatigued -= 0.003;
		}
		if (this.injured > 0) {
			this.injured -= 0.025;
		}
	}

	updateRotation() {
		let rotation = 0;
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.TURN_RIGHT]]) {
			rotation += 1;
		}
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.TURN_LEFT]]) {
			rotation -= 1;
		}

		if (rotation !== 0) {
			this.rotation = (this.rotation + (this.rotationSpeed * (rotation / 10))) % (2 * Math.PI);
		}
	}

	updateMovement(playground) {
		let leadDirection = 0;
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_FORWARD]]) {
			leadDirection += 1;
		}
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_BACKWARD]]) {
			leadDirection -= 1;
		}

		let sideDirection = 0;
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_RIGHT]]) {
			sideDirection += 1;
		}
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_LEFT]]) {
			sideDirection -= 1;
		}

		if (leadDirection !== 0 || sideDirection !== 0) {
			const coefficient = this.movementSpeed * (
				leadDirection !== 0 && sideDirection !== 0
					? Player.DIAGONAL_MOVEMENT_COEFFICIENT
					: Player.STRAIGHT_MOVEMENT_COEFFICIENT
			);
			leadDirection *= coefficient;
			sideDirection *= coefficient;

			const coordinatesDelta = {
				x: (leadDirection * Math.sin(this.rotation)) +
					(sideDirection * Math.sin(this.rotation + (Math.PI / 2))),
				y: (leadDirection * -Math.cos(this.rotation)) +
					(sideDirection * -Math.cos(this.rotation + (Math.PI / 2))),
			};

			playground.movePlayer(this, coordinatesDelta);
			playground.takeBall(this);
		}
	}

	stretch() {
		if (this.ball === null) {
			return;
		}

		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.SHOOT]]) {
			this.stretched += 0.01;
		} else if (this.stretched > 0) {
			this.shoot();
		}
	}

	shoot() {
		if (this.ball === null) {
			return;
		}
		if (this.stretched > Player.MAX_STRETCHED) {
			this.stretched = 0;
			return;
		}

		this.ball.rotation = this.rotation;
		this.ball.coordinates.x = this.coordinates.x;
		this.ball.coordinates.y = this.coordinates.y;
		this.ball.speed = 0.3 + (0.7 * Math.min(this.stretched, 1));
		this.ball.isDangerous = true;

		this.ball.holder = null;
		this.ball = null;

		this.stretched = 0;
		this.fatigued = 1;
		this.holdTime = 0;
	}

	updateBall() {
		if (this.ball === null) {
			return;
		}
		if (this.holdTime > 0) {
			this.holdTime -= 0.003;
			return;
		}

		this.ball.updateRotation(this.rotation + Math.PI);
		this.ball.coordinates.x = this.coordinates.x;
		this.ball.coordinates.y = this.coordinates.y;
		this.ball.speed = 0.2;
		this.ball.isDangerous = false;

		this.ball.holder = null;
		this.ball = null;

		this.stretched = 0;
		this.fatigued = 1;
	}

	setBall(ball) {
		this.ball = ball;
		this.ball.holder = this;
		this.ball.lastHolder = this;
		this.holdTime = 1;
	}

	injureBy(ball) {
		if (this.injuredBy === ball) {
			return;
		}
		if (this.lives <= 0) {
			return;
		}

		this.injuredBy = ball;
		this.injured = 1;
		this.lives--;

		ball.onHalt(() => {
			this.injuredBy = null;
		});
	}

	getLoaderLength() {
		if (this.lives <= 0) {
			return 0;
		}
		if (this.ball !== null && this.stretched > 0 && this.stretched <= Player.MAX_STRETCHED) {
			return Math.min(this.stretched, 1);
		}
		if (this.fatigued > 0) {
			return this.fatigued;
		}

		return 0;
	}

	render(context, playground) {
		this.update(playground);

		if (this.lives <= 0) {
			this.image.src = 'player-dead.png';
		} else if (this.ball !== null) {
			this.image.src = 'player-with-ball.png';
		} else if (this.injured > 0) {
			this.image.src = 'player-injured.png';
		} else {
			this.image.src = 'player.png';
		}

		context.save();
		context.translate(this.coordinates.x, this.coordinates.y);
		context.rotate(this.rotation);
		context.drawImage(
			this.image,
			-this.radius,
			-this.radius,
			this.radius * 2,
			this.radius * 2,
		);
		context.restore();

		const loaderLength = this.getLoaderLength();
		if (loaderLength > 0) {
			context.strokeStyle = '#f00';
			context.lineWidth = 2;
			context.beginPath();
			context.moveTo(this.coordinates.x - this.radius, this.coordinates.y - this.radius);
			context.lineTo(this.coordinates.x - this.radius + (loaderLength * 2 * this.radius), this.coordinates.y - this.radius);
			context.stroke();
		}

		if (this.lives > 0 && this.ball !== null && this.holdTime > 0) {
			context.strokeStyle = '#00f';
			context.lineWidth = 2;
			context.beginPath();
			context.moveTo(this.coordinates.x - this.radius, this.coordinates.y - this.radius + 2);
			context.lineTo(this.coordinates.x - this.radius + (this.holdTime * 2 * this.radius), this.coordinates.y - this.radius + 2);
			context.stroke();
		}

		if (this.injured > 0) {
			context.font = '14px Arial';
			context.fillText(this.lives.toString(), this.coordinates.x - 3, this.coordinates.y - this.radius - 5);
		}
	}

}
