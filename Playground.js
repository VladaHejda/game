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

	constructor(game, width, height, players, ball, walls) {
		this.game = game;
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

		this.players.forEach(player => player.render(context, this));
		this.ball.render(context);
		this.walls.forEach(wall => wall.render(context));
	}

	movePlayer(player, leadDirection, sideDirection) {
		const coordinatesDelta = {
			x: (leadDirection * Math.sin(player.rotation)) +
				(sideDirection * Math.sin(player.rotation + (Math.PI / 2))),
			y: (leadDirection * -Math.cos(player.rotation)) +
				(sideDirection * -Math.cos(player.rotation + (Math.PI / 2))),
		};

		this.players.forEach(otherPlayer => {
			if (otherPlayer === player) {
				return;
			}

			this.slowCirclesCollision(player, otherPlayer, coordinatesDelta);
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

			let newCoordinates = player.coordinates[dimension.name] + coordinatesDelta[dimension.name];
			newCoordinates = Math.max(newCoordinates, coordinatesLimits[dimension.directions.lower]);
			newCoordinates = Math.min(newCoordinates, coordinatesLimits[dimension.directions.higher]);

			player.coordinates[dimension.name] = newCoordinates;
		});
	}

	takeBall(player) {

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

	slowCirclesCollision(movedCircle, obstructingCircle, coordinatesDelta) {
		const movedCoordinates = {
			x: movedCircle.coordinates.x + coordinatesDelta.x,
			y: movedCircle.coordinates.y + coordinatesDelta.y,
		};

		let maxSquare = Math.pow(movedCoordinates.x - obstructingCircle.coordinates.x, 2) +
			Math.pow(movedCoordinates.y - obstructingCircle.coordinates.y, 2);
		let radiiSquare = Math.pow(movedCircle.radius + obstructingCircle.radius, 2);

		if (maxSquare < radiiSquare) {
			const fragment = maxSquare / radiiSquare;
			coordinatesDelta.x *= fragment;
			coordinatesDelta.y *= fragment;
		}
	}

}
