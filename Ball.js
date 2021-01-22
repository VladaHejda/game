class Ball {

	constructor(x, y) {
		this.image = new Image();
		this.image.src = 'ball.png';

		this.position = {
			x,
			y,
		};
		this.width = this.image.width;
		this.height = this.image.height;
	}

	render(context) {
		context.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.image.width,
			this.image.height,
		);
	}

}
