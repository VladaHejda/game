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

		const fixCanvasDimensions = function () {
			const shortestSize = Math.min(
				Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.95,
				Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) * 0.95,
			);
			canvas.width = shortestSize;
			canvas.height = shortestSize;
		};

		fixCanvasDimensions();
		window.addEventListener('resize', fixCanvasDimensions);

		class Player {

			constructor() {
				this.image = new Image();
				this.image.src = 'player.jpg';

				this.rotation = 0.0;
				this.position = {
					x: 200,
					y: 100,
				};
			}

			move(keysPressed) {
				if (keysPressed[KEY_CODES.LEFT]) {
					this.rotation -= 0.1;
				}
				if (keysPressed[KEY_CODES.RIGHT]) {
					this.rotation += 0.1;
				}
				if (keysPressed[KEY_CODES.UP]) {
					this.position.x += 3 * Math.sin(this.rotation);
					this.position.y -= 3 * Math.cos(this.rotation);
				}
				if (keysPressed[KEY_CODES.DOWN]) {
					this.position.x -= 3 * Math.sin(this.rotation);
					this.position.y += 3 * Math.cos(this.rotation);
				}

				context.save();
				context.translate(this.position.x, this.position.y);
				context.rotate(this.rotation);
				context.drawImage(
					this.image,
					-(this.image.width / 2),
					-(this.image.height / 2),
					this.image.width,
					this.image.height,
				);
				context.restore();
			}

		}

		const player = new Player();

		const KEY_CODES = {
			LEFT: 'ArrowLeft',
			UP: 'ArrowUp',
			RIGHT: 'ArrowRight',
			DOWN: 'ArrowDown',
		};

		const directions = [
			KEY_CODES.LEFT,
			KEY_CODES.UP,
			KEY_CODES.RIGHT,
			KEY_CODES.DOWN,
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

		let rot = 0.1;
		const main = function () {
			context.clearRect(0, 0, canvas.width, canvas.height);

			player.move(keysPressed);

			window.requestAnimationFrame(main);
		};

		window.requestAnimationFrame(main);
	</script>
</html>
