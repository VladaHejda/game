<!DOCTYPE html>
<html lang="cs">
<head title="The Game">
	<meta charset="UTF-8">
	<style type="text/css">
		#game {
			text-align: center;
		}
	</style>
</head>
	<div id="game">
		<canvas id="canvas"></canvas>
	</div>
	<script type="application/javascript">
		const canvas = document.getElementById('canvas');
		const context = canvas.getContext('2d');
		canvas.width = 500;
		canvas.height = 500;

		let player = new Image();
		player.src = 'poop.jpg';

		const playerPosition = {
			x: 200,
			y: 200,
		};

		const speed = {
			x: 0,
			y: 0,
		};

		const DIRECTION_CODES = {
			LEFT: 'ArrowLeft',
			UP: 'ArrowUp',
			RIGHT: 'ArrowRight',
			DOWN: 'ArrowDown',
		};

		const directions = [
			DIRECTION_CODES.LEFT,
			DIRECTION_CODES.UP,
			DIRECTION_CODES.RIGHT,
			DIRECTION_CODES.DOWN,
		];

		const keysPressed = {};
		for (let i = 0; i < directions.length; i++) {
			keysPressed[directions[i]] = false;
		}

		document.addEventListener('keydown', function (event) {
			keysPressed[event.key] = true;
		});
		document.addEventListener('keyup', function (event) {
			keysPressed[event.key] = false;
		});

		const main = function () {
			context.clearRect(playerPosition.x, playerPosition.y, 44, 44);

			for (let i = 0; i < directions.length; i++) {
				const isPressed = keysPressed[directions[i]];
				const delta = keysPressed[directions[i]] ? 2 : -1;

				switch (directions[i]) {
					case DIRECTION_CODES.LEFT:
						if (isPressed || speed.x < 0) {
							speed.x -=  delta;
						}
						break;
					case DIRECTION_CODES.UP:
						if (isPressed || speed.y < 0) {
							speed.y -= delta;
						}
						break;
					case DIRECTION_CODES.RIGHT:
						if (isPressed || speed.x > 0) {
							speed.x += delta;
						}
						break;
					case DIRECTION_CODES.DOWN:
						if (isPressed || speed.y > 0) {
							speed.y += delta;
						}
						break;
				}
			}

			for (let i = 0; i < directions.length; i++) {
				playerPosition.x += speed.x / 10;
				playerPosition.y += speed.y / 10;

				if (playerPosition.x < 0) {
					playerPosition.x = 0;
				} else if (playerPosition.x > canvas.width - 44) {
					playerPosition.x = canvas.width - 44;
				}
				if (playerPosition.y < 0) {
					playerPosition.y = 0;
				} else if (playerPosition.y > canvas.height - 44) {
					playerPosition.y = canvas.height - 44;
				}
			}

			context.save();
			context.rotate(0.5);
			context.drawImage(player, playerPosition.x, playerPosition.y, 44, 44);
			context.restore();

			window.requestAnimationFrame(main);
		};

		window.requestAnimationFrame(main);
	</script>
</html>
