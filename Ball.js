class Ball {

	constructor(x, y) {
		this.image = new Image();
		this.image.src = 'ball.png';

		this.coordinates = {
			x,
			y,
		};
		this.radius = this.image.width / 2;
	}

	render(context) {
		context.drawImage(
			this.image,
			this.coordinates.x,
			this.coordinates.y,
			this.radius * 2,
			this.radius * 2,
		);
	}

}
