class Playground {

	constructor(game, width, height, players, walls) {
		this.game = game;
		this.width = width;
		this.height = height;
		this.players = players;
		this.walls = walls;
	}

	render(context) {
		context.clearRect(0, 0, this.width, this.height);
		context.strokeStyle = '#000';
		context.strokeRect(0, 0, this.width, this.height);

		this.players.forEach(player => player.render(context, this));
		this.walls.forEach(wall => wall.render(context));
	}

	movePlayer(player, leadDirection, sideDirection) {
		let coefficient = 3;
		if (leadDirection !== 0 && sideDirection !== 0) {
			coefficient = Math.sqrt(Math.pow(coefficient, 2) / 2);
		}

		const newPosition = {
			x: Math.max(Math.min(
				player.position.x +
				(player.movementSpeed * leadDirection * coefficient * Math.sin(player.rotation)) +
				(player.movementSpeed * sideDirection * coefficient * Math.sin(player.rotation + (Math.PI / 2))),
				this.width - player.image.width - 1,
			), 1),
			y: Math.max(Math.min(
				player.position.y -
				(player.movementSpeed * leadDirection * coefficient * Math.cos(player.rotation)) -
				(player.movementSpeed * sideDirection * coefficient * Math.cos(player.rotation + (Math.PI / 2))),
				this.height - player.image.height - 1,
			), 1),
		};

		const playerBoundingBox = {
			left: newPosition.x,
			right: newPosition.x + player.image.width,
			top: newPosition.y,
			bottom: newPosition.y + player.image.height,
		};

		const positionFixed = {
			horizontal: false,
			vertical: false,
		};

		for (let i = 0; i < this.walls.length; i++) {
			// todo moc argumentů fuj! zkusit ty kolize zjednodušit a opravit bugy
			if (!this.calculateCollision(player, newPosition, playerBoundingBox, positionFixed, this.walls[i])) {
				break;
			}
		}

		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i] === player) {
				continue;
			}

			if (!this.calculateCollision(player, newPosition, playerBoundingBox, positionFixed, this.players[i])) {
				break;
			}
		}

		player.position.x = newPosition.x;
		player.position.y = newPosition.y;
	}

	calculateCollision(player, newPosition, playerBoundingBox, positionFixed, obstruction) {
		const intersects = {
			horizontally: Math.min(
				Math.max(playerBoundingBox.right - obstruction.position.x, 0),
				Math.max((obstruction.position.x + obstruction.width) - playerBoundingBox.left, 0),
			),
			vertically: Math.min(
				Math.max(playerBoundingBox.bottom - obstruction.position.y, 0),
				Math.max((obstruction.position.y + obstruction.height) - playerBoundingBox.top, 0),
			),
		};

		const possibleSuspension = {
			horizontally: !positionFixed.horizontal && intersects.vertically > 0,
			vertically: !positionFixed.vertical && intersects.horizontally > 0,
		};

		if (
			possibleSuspension.horizontally
			&& intersects.vertically > intersects.horizontally
		) {
			if (
				newPosition.x < player.position.x
				&& playerBoundingBox.left < obstruction.position.x + obstruction.width
				&& playerBoundingBox.right > obstruction.position.x + obstruction.width
			) {
				newPosition.x = obstruction.position.x + obstruction.width;
				positionFixed.horizontal = true;

			} else if (
				newPosition.x > player.position.x
				&& playerBoundingBox.right > obstruction.position.x
				&& playerBoundingBox.left < obstruction.position.x
			) {
				newPosition.x = obstruction.position.x - player.image.width;
				positionFixed.horizontal = true;
			}

		} else if (
			possibleSuspension.vertically
			&& intersects.horizontally > intersects.vertically
		) {
			if (
				newPosition.y < player.position.y
				&& playerBoundingBox.top < obstruction.position.y + obstruction.height
				&& playerBoundingBox.bottom > obstruction.position.y + obstruction.height
			) {
				newPosition.y = obstruction.position.y + obstruction.height;
				positionFixed.vertical = true;

			} else if (
				newPosition.y > player.position.y
				&& playerBoundingBox.bottom > obstruction.position.y
				&& playerBoundingBox.top < obstruction.position.y
			) {
				newPosition.y = obstruction.position.y - player.image.height;
				positionFixed.vertical = true;
			}
		}

		return !positionFixed.horizontal || !positionFixed.vertical;
	}

}
