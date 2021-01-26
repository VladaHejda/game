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

		const newCoordinatesDelta = this.getCoordinatesDeltaReducedByWalls(player, coordinatesDelta);
		player.coordinates.x += newCoordinatesDelta.x;
		player.coordinates.y += newCoordinatesDelta.y;
	}

	moveBall(ball, coordinatesDelta) {
		this.players.forEach(otherPlayer => {
			if (otherPlayer === ball.lastHolder) {
				return;
			}
			if (this.doesCirclesCollide(ball, otherPlayer)) {
				otherPlayer.injure();
			}
		});

		const newCoordinatesDelta = this.getCoordinatesDeltaReducedByWalls(ball, coordinatesDelta);

		const bounce = {
			x: coordinatesDelta.x - newCoordinatesDelta.x,
			y: coordinatesDelta.y - newCoordinatesDelta.y,
		};

		ball.coordinates.x += newCoordinatesDelta.x - bounce.x;
		ball.coordinates.y += newCoordinatesDelta.y - bounce.y;

		const halfPI = Math.PI / 2;
		let quadrantMutation = (coordinatesDelta.x * coordinatesDelta.y) > 0 ? 1 : -1;

		Playground.DIMENSIONS.forEach(dimension => {
			if (bounce[dimension.name] === 0) {
				quadrantMutation = -quadrantMutation;
				return;
			}

			ball.lastHolder = null;

			const quadrant = ball.rotation / halfPI;
			const rounder = quadrantMutation > 0
				? Math.ceil
				: Math.floor;
			const quadrantRotation = rounder(quadrant) * halfPI;

			ball.updateRotation(quadrantRotation + (quadrantRotation - ball.rotation));
		});
	}

	getCoordinatesDeltaReducedByWalls(circle, coordinatesDelta) {
		const coordinatesLimits = {
			[Playground.MOVEMENT_DIRECTION.LEFT]: circle.radius + 1,
			[Playground.MOVEMENT_DIRECTION.RIGHT]: this.width - circle.radius - 1,
			[Playground.MOVEMENT_DIRECTION.UP]: circle.radius + 1,
			[Playground.MOVEMENT_DIRECTION.DOWN]: this.height - circle.radius - 1,
		};

		const newCoordinatesDelta = {
			x: 0,
			y: 0,
		};

		Playground.DIMENSIONS.forEach(dimension => {
			if (coordinatesDelta[dimension.name] === 0) {
				return;
			}

			let direction;
			let limiter;
			if (coordinatesDelta[dimension.name] < 0) {
				direction = dimension.directions.lower;
				limiter = Math.max;
			} else {
				direction = dimension.directions.higher;
				limiter = Math.min;
			}

			this.walls.forEach(wall => {
				const limit = this.findCoordinatesLimit(circle, wall, direction);
				if (limit !== null) {
					coordinatesLimits[direction] = limiter(coordinatesLimits[direction], limit)
				}
			});

			newCoordinatesDelta[dimension.name] = limiter(
				coordinatesLimits[direction] - circle.coordinates[dimension.name],
				coordinatesDelta[dimension.name],
			);
		});

		return newCoordinatesDelta;
	}

	takeBall(player) {
		if (this.ball.holder !== null) {
			return;
		}
		if (this.ball.speed > 0) {
			return;
		}
		if (player.fatigued > 0) {
			return;
		}
		if (!this.doesCirclesCollide(player, this.ball)) {
			return;
		}

		player.setBall(this.ball);
	}

	findCoordinatesLimit(circle, obstruction, direction) {
		const circleBoundingBox = {
			left: circle.coordinates.x - circle.radius,
			right: circle.coordinates.x + circle.radius,
			top: circle.coordinates.y - circle.radius,
			bottom: circle.coordinates.y + circle.radius,
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
				canObstruct = circleBoundingBox.top <= obstructionBoundingBox.bottom
					&& circleBoundingBox.bottom >= obstructionBoundingBox.top;
				break;
			case Playground.MOVEMENT_DIRECTION.UP:
			case Playground.MOVEMENT_DIRECTION.DOWN:
				canObstruct = circleBoundingBox.left <= obstructionBoundingBox.right
					&& circleBoundingBox.right >= obstructionBoundingBox.left;
				break;
		}

		if (!canObstruct) {
			return null;
		}

		let limit;
		switch (direction) {
			case Playground.MOVEMENT_DIRECTION.LEFT:
				canObstruct = obstructionBoundingBox.right < circleBoundingBox.left;
				limit = obstructionBoundingBox.right + circle.radius + 1;
				break;
			case Playground.MOVEMENT_DIRECTION.RIGHT:
				canObstruct = obstructionBoundingBox.left > circleBoundingBox.right;
				limit = obstructionBoundingBox.left - circle.radius - 1;
				break;
			case Playground.MOVEMENT_DIRECTION.UP:
				canObstruct = obstructionBoundingBox.bottom < circleBoundingBox.top;
				limit = obstructionBoundingBox.bottom + circle.radius + 1;
				break;
			case Playground.MOVEMENT_DIRECTION.DOWN:
				canObstruct = obstructionBoundingBox.top > circleBoundingBox.bottom;
				limit = obstructionBoundingBox.top - circle.radius - 1;
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
