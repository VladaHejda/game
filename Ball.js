class Ball {

	constructor(x, y) {
		this.image = new Image();
		this.image.src = 'ball.png';

		this.coordinates = {
			x,
			y,
		};
		this.radius = this.image.width / 2;

		this.holder = null;
	}

	render(context) {
		if (this.holder !== null) {
			return;
		}

		context.drawImage(
			this.image,
			this.coordinates.x - this.radius,
			this.coordinates.y - this.radius,
			this.radius * 2,
			this.radius * 2,
		);
	}

}
