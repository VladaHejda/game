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
		const positionLimits = {
			[Playground.MOVEMENT_DIRECTION.LEFT]: 1,
			[Playground.MOVEMENT_DIRECTION.RIGHT]: this.width - player.width - 1,
			[Playground.MOVEMENT_DIRECTION.UP]: 1,
			[Playground.MOVEMENT_DIRECTION.DOWN]: this.height - player.height - 1,
		};

		const obstructions = [];
		this.walls.forEach(wall => obstructions.push(wall));
		this.players.forEach(otherPlayer => {
			if (otherPlayer !== player) {
				obstructions.push(otherPlayer);
			}
		});

		const positionDelta = {
			x: (leadDirection * Math.sin(player.rotation)) +
				(sideDirection * Math.sin(player.rotation + (Math.PI / 2))),
			y: (leadDirection * -Math.cos(player.rotation)) +
				(sideDirection * -Math.cos(player.rotation + (Math.PI / 2))),
		};

		Playground.DIMENSIONS.forEach(dimension => {
			let direction;
			if (positionDelta[dimension.name] < 0) {
				direction = dimension.directions.lower;
			} else if (positionDelta[dimension.name] > 0) {
				direction = dimension.directions.higher;
			} else {
				return;
			}

			obstructions.forEach(obstruction => {
				const limit = this.findPositionLimit(player, obstruction, direction);

				if (limit !== null) {
					positionLimits[direction] = direction === dimension.directions.lower
						? Math.max(positionLimits[direction], limit)
						: Math.min(positionLimits[direction], limit);
				}
			});

			let newPosition = player.position[dimension.name] + positionDelta[dimension.name];
			newPosition = Math.max(newPosition, positionLimits[dimension.directions.lower]);
			newPosition = Math.min(newPosition, positionLimits[dimension.directions.higher]);

			player.position[dimension.name] = newPosition;
		});
	}

	takeBall(player) {

	}

	findPositionLimit(subject, obstruction, direction) {
		const subjectBoundingBox = {
			left: subject.position.x,
			right: subject.position.x + subject.width,
			top: subject.position.y,
			bottom: subject.position.y + subject.height,
		};

		const obstructionBoundingBox = {
			left: obstruction.position.x,
			right: obstruction.position.x + obstruction.width,
			top: obstruction.position.y,
			bottom: obstruction.position.y + obstruction.height,
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
				limit = obstructionBoundingBox.right + 1;
				break;
			case Playground.MOVEMENT_DIRECTION.RIGHT:
				canObstruct = obstructionBoundingBox.left > subjectBoundingBox.right;
				limit = obstructionBoundingBox.left - subject.width - 1;
				break;
			case Playground.MOVEMENT_DIRECTION.UP:
				canObstruct = obstructionBoundingBox.bottom < subjectBoundingBox.top;
				limit = obstructionBoundingBox.bottom + 1;
				break;
			case Playground.MOVEMENT_DIRECTION.DOWN:
				canObstruct = obstructionBoundingBox.top > subjectBoundingBox.bottom;
				limit = obstructionBoundingBox.top - subject.height - 1;
				break;
		}

		return canObstruct ? limit : null;
	}

}
