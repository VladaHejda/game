class Playground {

	static MOVEMENT_DIRECTION = {
		LEFT: 0,
		RIGHT: 1,
		UP: 2,
		DOWN: 3,
	};

	static DIMENSIONS = [
		{
			name: 'x',
			directions: {
				lower: Playground.MOVEMENT_DIRECTION.LEFT,
				higher: Playground.MOVEMENT_DIRECTION.RIGHT,
			},
		},
		{
			name: 'y',
			directions: {
				lower: Playground.MOVEMENT_DIRECTION.UP,
				higher: Playground.MOVEMENT_DIRECTION.DOWN,
			},
		},
	];

	constructor(width, height, players, ball, walls) {
		this.width = width;
		this.height = height;
		this.players = players;
		this.ball = ball;
		this.walls = walls;
	}

	render(context) {
		context.clearRect(0, 0, this.width, this.height);
		context.strokeStyle = '#000';
		context.strokeRect(0, 0, this.width, this.height);

		this.ball.render(context, this);
		this.players.forEach(player => player.render(context, this));
		this.walls.forEach(wall => wall.render(context));
	}

	movePlayer(player, coordinatesDelta) {
		this.players.forEach(otherPlayer => {
			if (otherPlayer === player) {
				return;
			}

			if (this.doesCirclesCollide(player, otherPlayer)) {
				coordinatesDelta.x *= 0.2;
				coordinatesDelta.y *= 0.2;
			}
		});

		const coordinatesLimits = {
			[Playground.MOVEMENT_DIRECTION.LEFT]: player.radius + 1,
			[Playground.MOVEMENT_DIRECTION.RIGHT]: this.width - player.radius - 1,
			[Playground.MOVEMENT_DIRECTION.UP]: player.radius + 1,
			[Playground.MOVEMENT_DIRECTION.DOWN]: this.height - player.radius - 1,
		};

		Playground.DIMENSIONS.forEach(dimension => {
			let direction;
			this.walls.forEach(obstruction => {
				if (coordinatesDelta[dimension.name] < 0) {
					direction = dimension.directions.lower;
				} else if (coordinatesDelta[dimension.name] > 0) {
					direction = dimension.directions.higher;
				} else {
					return;
				}
				const limit = this.findCoordinatesLimit(player, obstruction, direction);

				if (limit !== null) {
					coordinatesLimits[direction] = direction === dimension.directions.lower
						? Math.max(coordinatesLimits[direction], limit)
						: Math.min(coordinatesLimits[direction], limit);
				}
			});

			let newDelta = coordinatesDelta[dimension.name];
			newDelta = Math.max(coordinatesLimits[dimension.directions.lower] - player.coordinates[dimension.name], newDelta);
			newDelta = Math.min(coordinatesLimits[dimension.directions.higher] - player.coordinates[dimension.name], newDelta);

			player.coordinates[dimension.name] = player.coordinates[dimension.name] + newDelta;
		});
	}

	moveBall(ball, coordinatesDelta) {
		const coordinatesLimits = {
			[Playground.MOVEMENT_DIRECTION.LEFT]: ball.radius + 1,
			[Playground.MOVEMENT_DIRECTION.RIGHT]: this.width - ball.radius - 1,
			[Playground.MOVEMENT_DIRECTION.UP]: ball.radius + 1,
			[Playground.MOVEMENT_DIRECTION.DOWN]: this.height - ball.radius - 1,
		};

		Playground.DIMENSIONS.forEach(dimension => {
			let direction;
			this.walls.forEach(obstruction => {
				if (coordinatesDelta[dimension.name] < 0) {
					direction = dimension.directions.lower;
				} else if (coordinatesDelta[dimension.name] > 0) {
					direction = dimension.directions.higher;
				} else {
					return;
				}
				const limit = this.findCoordinatesLimit(ball, obstruction, direction);

				if (limit !== null) {
					coordinatesLimits[direction] = direction === dimension.directions.lower
						? Math.max(coordinatesLimits[direction], limit)
						: Math.min(coordinatesLimits[direction], limit);
				}
			});

			let newDelta = coordinatesDelta[dimension.name];
			newDelta = Math.max(coordinatesLimits[dimension.directions.lower] - ball.coordinates[dimension.name], newDelta);
			newDelta = Math.min(coordinatesLimits[dimension.directions.higher] - ball.coordinates[dimension.name], newDelta);

			ball.coordinates[dimension.name] = ball.coordinates[dimension.name] + newDelta;
		});
	}

	takeBall(player) {
		if (this.ball.holder !== null) {
			return;
		}
		if (this.ball.speed > 0) {
			return;
		}
		if (!this.doesCirclesCollide(player, this.ball)) {
			return;
		}

		player.setBall(this.ball);
	}

	findCoordinatesLimit(subject, obstruction, direction) {
		const subjectBoundingBox = {
			left: subject.coordinates.x - subject.radius,
			right: subject.coordinates.x + subject.radius,
			top: subject.coordinates.y - subject.radius,
			bottom: subject.coordinates.y + subject.radius,
		};

		const obstructionBoundingBox = {
			left: obstruction.coordinates.x,
			right: obstruction.coordinates.x + obstruction.width,
			top: obstruction.coordinates.y,
			bottom: obstruction.coordinates.y + obstruction.height,
		};

		let canObstruct;
		switch (direction) {
			case Playground.MOVEMENT_DIRECTION.LEFT:
			case Playground.MOVEMENT_DIRECTION.RIGHT:
				canObstruct = subjectBoundingBox.top <= obstructionBoundingBox.bottom
					&& subjectBoundingBox.bottom >= obstructionBoundingBox.top;
				break;
			case Playground.MOVEMENT_DIRECTION.UP:
			case Playground.MOVEMENT_DIRECTION.DOWN:
				canObstruct = subjectBoundingBox.left <= obstructionBoundingBox.right
					&& subjectBoundingBox.right >= obstructionBoundingBox.left;
				break;
		}

		if (!canObstruct) {
			return null;
		}

		let limit;
		switch (direction) {
			case Playground.MOVEMENT_DIRECTION.LEFT:
				canObstruct = obstructionBoundingBox.right < subjectBoundingBox.left;
				limit = obstructionBoundingBox.right + subject.radius + 1;
				break;
			case Playground.MOVEMENT_DIRECTION.RIGHT:
				canObstruct = obstructionBoundingBox.left > subjectBoundingBox.right;
				limit = obstructionBoundingBox.left - subject.radius - 1;
				break;
			case Playground.MOVEMENT_DIRECTION.UP:
				canObstruct = obstructionBoundingBox.bottom < subjectBoundingBox.top;
				limit = obstructionBoundingBox.bottom + subject.radius + 1;
				break;
			case Playground.MOVEMENT_DIRECTION.DOWN:
				canObstruct = obstructionBoundingBox.top > subjectBoundingBox.bottom;
				limit = obstructionBoundingBox.top - subject.radius - 1;
				break;
		}

		return canObstruct ? limit : null;
	}

	doesCirclesCollide(movedCircle, obstructingCircle) {
		let maxSquare = Math.pow(movedCircle.coordinates.x - obstructingCircle.coordinates.x, 2) +
			Math.pow(movedCircle.coordinates.y - obstructingCircle.coordinates.y, 2);
		let radiiSquare = Math.pow(movedCircle.radius + obstructingCircle.radius, 2);

		return maxSquare < radiiSquare;
	}

}
