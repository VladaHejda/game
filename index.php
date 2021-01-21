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

		class Playground {

			constructor(context, keysPressed) {
				this.context = context;
				this.keysPressed = keysPressed;
				this.player = new Player(this.context);
			}

			render() {
				this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
				this.context.strokeRect(0, 0, this.context.canvas.width, this.context.canvas.height);

				if (this.keysPressed[KEY_CODES.LEFT]) {
					this.player.rotate(-1);
				}
				if (this.keysPressed[KEY_CODES.RIGHT]) {
					this.player.rotate(1);
				}
				if (this.keysPressed[KEY_CODES.UP]) {
					this.player.move(1);
				}
				if (this.keysPressed[KEY_CODES.DOWN]) {
					this.player.move(-1);
				}

				this.player.render();
			}

		}

		class Player {

			constructor(context) {
				this.context = context;

				this.image = new Image();
				this.image.src = 'player.jpg';

				this.rotation = 0.0;
				this.position = {
					x: 200,
					y: 100,
				};
			}

			move(speed) {
				this.position.x = Math.max(Math.min(
					this.position.x + (speed * 3 * Math.sin(this.rotation)),
					this.context.canvas.width - (this.image.width / 2) - 1,
				), (this.image.width / 2) + 1);
				this.position.y = Math.max(Math.min(
					this.position.y - (speed * 3 * Math.cos(this.rotation)),
					this.context.canvas.height - (this.image.height / 2) - 1,
				), (this.image.height / 2) + 1);
			}

			rotate(speed) {
				this.rotation = (this.rotation + (speed / 10)) % (2 * Math.PI);
			}

			render() {
				this.context.save();
				this.context.translate(this.position.x, this.position.y);
				this.context.rotate(this.rotation);
				this.context.drawImage(
					this.image,
					-(this.image.width / 2),
					-(this.image.height / 2),
					this.image.width,
					this.image.height,
				);
				this.context.restore();
			}

		}

		class Bullet {

			constructor() {
				this.image = new Image();
				this.image.src = 'bullet.jpg';

				this.position = {
					x: 100,
					y: 300,
				};
			}

			render() {
				context.save();
				context.translate(this.position.x, this.position.y);
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

		const KEY_CODES = {
			LEFT: 'ArrowLeft',
			UP: 'ArrowUp',
			RIGHT: 'ArrowRight',
			DOWN: 'ArrowDown',
			SPACE: 'Space',
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

		const onKeyPress = function (keyCode, wasPressed) {
			for (let i = 0; i < directions.length; i++) {
				if (keyCode === directions[i]) {
					keysPressed[keyCode] = wasPressed;
					break;
				}
			}
			if (keyCode === KEY_CODES.SPACE && wasPressed) {
				keysPressed[keyCode] = true;
			}
		};

		document.addEventListener('keydown', function (event) {
			onKeyPress(event.key, true);
		});
		document.addEventListener('keyup', function (event) {
			onKeyPress(event.key, false);
		});

		const playground = new Playground(context, keysPressed);
		const bullet = new Bullet();

		const render = function () {
			playground.render();

			if (keysPressed[KEY_CODES.SPACE]) {
				keysPressed[KEY_CODES.SPACE] = false;

			}

			bullet.render(keysPressed);

			window.requestAnimationFrame(render);
		};

		window.requestAnimationFrame(render);

		/*
		vybíjená:
		- kdo měl míč naposled, nemůže ho mít znova
		- stiskem mezerníku se začne "rozpřahovat", čím déle se rozpřahuje, tím dále dostřelí (má to maximum, když ho přežene, nevystřelí vůbec, maximum chvilku bliká)
		- může držet míc max např. 5 vtěřin, pak ho automaticky pustí (např. kousek směrem dozadu)
		- míč se odráží od zdí, tím ztrácí rychlost, když se zastaví, změní barvu (aby to bylo poznat) a další hráč ho může sebrat
		- hráč může (odražením) vybít sám sebe
		 */
	</script>
</html>
