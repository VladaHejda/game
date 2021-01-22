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

	movePlayer(player, direction) {
		const newPosition = {
			x: Math.max(Math.min(
				player.position.x + (player.movementSpeed * direction * 3 * Math.sin(player.rotation)),
				this.width - (player.image.width / 2) - 1,
			), (player.image.width / 2) + 1),
			y: Math.max(Math.min(
				player.position.y - (player.movementSpeed * direction * 3 * Math.cos(player.rotation)),
				this.height - (player.image.height / 2) - 1,
			), (player.image.height / 2) + 1),
		};

		const playerBoundingBox = {
			left: newPosition.x - (player.image.width / 2),
			right: newPosition.x + (player.image.width / 2),
			top: newPosition.y - (player.image.height / 2),
			bottom: newPosition.y + (player.image.height / 2),
		};

		const positionFixed = {
			horizontal: false,
			vertical: false,
		};

		for (let i = 0; i < this.walls.length; i++) {
			const wall = this.walls[i];

			const intersects = {
				horizontally: Math.min(
					Math.max(playerBoundingBox.right - wall.position.x, 0),
					Math.max((wall.position.x + wall.width) - playerBoundingBox.left, 0),
				),
				vertically: Math.min(
					Math.max(playerBoundingBox.bottom - wall.position.y, 0),
					Math.max((wall.position.y + wall.height) - playerBoundingBox.top, 0),
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
					&& playerBoundingBox.left < wall.position.x + wall.width
					&& playerBoundingBox.right > wall.position.x + wall.width
				) {
					newPosition.x = wall.position.x + wall.width + (player.image.width / 2);
					positionFixed.horizontal = true;

				} else if (
					newPosition.x > player.position.x
					&& playerBoundingBox.right > wall.position.x
					&& playerBoundingBox.left < wall.position.x
				) {
					newPosition.x = wall.position.x - (player.image.width / 2);
					positionFixed.horizontal = true;
				}

			} else if (
				possibleSuspension.vertically
				&& intersects.horizontally > intersects.vertically
			) {
				if (
					newPosition.y < player.position.y
					&& playerBoundingBox.top < wall.position.y + wall.height
					&& playerBoundingBox.bottom > wall.position.y + wall.height
				) {
					newPosition.y = wall.position.y + wall.height + (player.image.height / 2);
					positionFixed.vertical = true;

				} else if (
					newPosition.y > player.position.y
					&& playerBoundingBox.bottom > wall.position.y
					&& playerBoundingBox.top < wall.position.y
				) {
					newPosition.y = wall.position.y - (player.image.height / 2);
					positionFixed.vertical = true;
				}
			}

			if (positionFixed.horizontal && positionFixed.vertical) {
				break;
			}
		}

		player.position.x = newPosition.x;
		player.position.y = newPosition.y;
	}

}
