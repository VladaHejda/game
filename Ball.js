class Ball {

	static MOVEMENT_COEFFICIENT = 10;

	constructor(x, y) {
		this.image = new Image();
		this.image.src = 'ball.png';

		this.coordinates = {
			x,
			y,
		};
		this.rotation = 0.0;
		this.radius = this.image.width / 2;
		this.speed = 0;

		this.holder = null;
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
	}

	render(context, playground) {
		if (this.holder !== null) {
			return;
		}

		this.update(playground);

		context.drawImage(
			this.image,
			this.coordinates.x - this.radius,
			this.coordinates.y - this.radius,
			this.radius * 2,
			this.radius * 2,
		);
	}

}
