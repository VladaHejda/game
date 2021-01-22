class Player {

	static CONTROL_ACTIONS = {
		LEFT: 0,
		RIGHT: 1,
		UP: 2,
		DOWN: 3,
	};

	static MOVEMENT_DIRECTION = {
		FORWARD: 1,
		BACKWARD: -1,
	};

	constructor(game, x, y, controls) {
		this.game = game;
		this.controls = controls;

		this.image = new Image();
		this.image.src = 'player.png';

		this.rotation = 0.0;
		this.position = {
			x,
			y,
		};
		this.width = this.image.width;
		this.height = this.image.height;

		this.movementSpeed = 1;
		this.rotationSpeed = 1;
	}

	updateRotation() {
		let rotation = 0;
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.LEFT]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.RIGHT]]) {
			rotation = -1;
		} else if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.RIGHT]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.LEFT]]) {
			rotation = 1;
		}

		if (rotation !== 0) {
			this.rotation = (this.rotation + (this.rotationSpeed * (rotation / 10))) % (2 * Math.PI);
		}
	}

	updateMovement(playground) {
		let movement = null;
		if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.UP]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.DOWN]]) {
			movement = Player.MOVEMENT_DIRECTION.FORWARD;
		} else if (this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.DOWN]] && !this.game.keysPressed[this.controls[Player.CONTROL_ACTIONS.UP]]) {
			movement = Player.MOVEMENT_DIRECTION.BACKWARD;
		}
		if (movement !== null) {
			playground.movePlayer(this, movement);
		}
	}

	render(context, playground) {
		this.updateRotation();
		this.updateMovement(playground);

		context.save();
		context.translate(this.position.x + (this.image.width / 2), this.position.y + (this.image.height / 2));
		context.rotate(this.rotation);
		context.drawImage(
			this.image,
			-(this.image.width / 2),
			-(this.image.height / 2),
			this.image.width,
			this.image.height,
		);
		context.restore();
	}

}
