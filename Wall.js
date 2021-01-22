class Wall {

	constructor(x, y, width, height) {
		this.position = {
			x,
			y,
		};
		this.width = width;
		this.height = height;
	}

	render(context) {
		context.fillStyle = '#000';
		context.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

}
