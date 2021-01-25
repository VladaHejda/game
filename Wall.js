class Wall {

	constructor(x, y, width, height) {
		this.coordinates = {
			x,
			y,
		};
		this.width = width;
		this.height = height;
	}

	render(context) {
		context.fillStyle = '#000';
		context.fillRect(this.coordinates.x, this.coordinates.y, this.width, this.height);
	}

}
