class Player {

	static CONTROL_ACTIONS = {
		TURN_LEFT: 0,
		TURN_RIGHT: 1,
		GO_FORWARD: 2,
		GO_BACKWARD: 3,
		GO_LEFT: 4,
		GO_RIGHT: 5,
	};

	static STRAIGHT_MOVEMENT_COEFFICIENT = 3;
	static DIAGONAL_MOVEMENT_COEFFICIENT = Math.sqrt(Math.pow(Player.STRAIGHT_MOVEMENT_COEFFICIENT, 2) / 2);

	constructor(game, x, y, controls) {
		this.game = game;
		this.controls = controls;

		this.image = new Image();
		this.image.src = 'player.png';

		this.rotation = 0.0;
		this.coordinates = {
			x,
			y,
		};
		this.radius = this.image.width / 2;

		this.movementSpeed = 1;
		this.rotationSpeed = 1;
	}

	updateRotation() {
		let rotation = 0;
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.TURN_LEFT]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.TURN_RIGHT]]) {
			rotation = -1;
		} else if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.TURN_RIGHT]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.TURN_LEFT]]) {
			rotation = 1;
		}

		if (rotation !== 0) {
			this.rotation = (this.rotation + (this.rotationSpeed * (rotation / 10))) % (2 * Math.PI);
		}
	}

	updateMovement(playground) {
		let leadDirection = 0;
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_FORWARD]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_BACKWARD]]) {
			leadDirection = 1;
		} else if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_BACKWARD]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_FORWARD]]) {
			leadDirection = -1;
		}

		let sideDirection = 0;
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_RIGHT]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_LEFT]]) {
			sideDirection = 1;
		} else if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_LEFT]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.GO_RIGHT]]) {
			sideDirection = -1;
		}

		if (leadDirection !== 0 || sideDirection !== 0) {
			const coefficient = this.movementSpeed * (
				leadDirection !== 0 && sideDirection !== 0
					? Player.DIAGONAL_MOVEMENT_COEFFICIENT
					: Player.STRAIGHT_MOVEMENT_COEFFICIENT
			);
			leadDirection *= coefficient;
			sideDirection *= coefficient;

			playground.movePlayer(this, leadDirection, sideDirection);
			playground.takeBall(this);
		}
	}

	render(context, playground) {
		this.updateRotation();
		this.updateMovement(playground);

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
	}

}
