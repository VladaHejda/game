class Ball {

	static MOVEMENT_COEFFICIENT = 14;

	constructor(x, y) {
		this.image = new Image();

		this.coordinates = {
			x,
			y,
		};
		this.rotation = 0.0;
		this.radius = 10;
		this.speed = 0;
		this.isDangerous = false;

		this.holder = null;
		this.lastHolder = null;

		this.onHaltCallbacks = [];
	}

	update(playground) {
		if (this.speed <= 0) {
			return;
		}

		const coordinatesDelta = {
			x: (Ball.MOVEMENT_COEFFICIENT * this.speed * Math.sin(this.rotation)),
			y: (Ball.MOVEMENT_COEFFICIENT * this.speed * -Math.cos(this.rotation)),
		};

		playground.moveBall(this, coordinatesDelta);

		this.speed -= 0.01;

		if (this.speed <= 0) {
			this.onHaltCallbacks.forEach(callback => callback());
			this.onHaltCallbacks = [];
		}
	}

	onHalt(callback) {
		this.onHaltCallbacks.push(callback);
	}

	updateRotation(rotation) {
		this.rotation = rotation % (2 * Math.PI);
	}

	render(context, playground) {
		if (this.holder !== null) {
			return;
		}

		this.update(playground);

		this.image.src = 'ball.png';

		context.drawImage(
			this.image,
			this.coordinates.x - this.radius,
			this.coordinates.y - this.radius,
			this.radius * 2,
			this.radius * 2,
		);
	}

}
