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
				this.walls = [
					new Wall(this.context, 150, 300, 100, 200),
					new Wall(this.context, 400, 400, 100, 50),
					new Wall(this.context, 250, 400, 130, 100),
					new Wall(this.context, 480, 350, 20, 50),
				];

				this.context.strokeStyle = '#000';
			}

			render() {
				this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
				this.context.strokeRect(0, 0, this.context.canvas.width, this.context.canvas.height);

				let rotation = 0;
				if (this.keysPressed[KEY_CODES.LEFT] && !this.keysPressed[KEY_CODES.RIGHT]) {
					rotation = -1;
				} else if (this.keysPressed[KEY_CODES.RIGHT] && !this.keysPressed[KEY_CODES.LEFT]) {
					rotation = 1;
				}

				let movement = 0;
				if (this.keysPressed[KEY_CODES.UP] && !this.keysPressed[KEY_CODES.DOWN]) {
					movement = 1;
				} else if (this.keysPressed[KEY_CODES.DOWN] && !this.keysPressed[KEY_CODES.UP]) {
					movement = -1;
				}

				if (rotation !== 0) {
					this.player.rotation = (this.player.rotation + (rotation / 10)) % (2 * Math.PI);
				}

				if (movement !== 0) {
					const newPosition = {
						x: Math.max(Math.min(
							this.player.position.x + (movement * 3 * Math.sin(this.player.rotation)),
							this.context.canvas.width - (this.player.image.width / 2) - 1,
						), (this.player.image.width / 2) + 1),
						y: Math.max(Math.min(
							this.player.position.y - (movement * 3 * Math.cos(this.player.rotation)),
							this.context.canvas.height - (this.player.image.height / 2) - 1,
						), (this.player.image.height / 2) + 1),
					};

					const playerBoundingBox = {
						left: newPosition.x - (this.player.image.width / 2),
						right: newPosition.x + (this.player.image.width / 2),
						top: newPosition.y - (this.player.image.height / 2),
						bottom: newPosition.y + (this.player.image.height / 2),
					};

					const positionFixed = {
						x: false,
						y: false,
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

						if (
							!positionFixed.x
							&& intersects.vertically > 0
							&& intersects.vertically > intersects.horizontally
						) {
							if (
								newPosition.x < this.player.position.x
								&& playerBoundingBox.left < wall.position.x + wall.width
								&& playerBoundingBox.right > wall.position.x + wall.width
							) {
								newPosition.x = wall.position.x + wall.width + (this.player.image.width / 2);
								positionFixed.x = true;

							} else if (
								newPosition.x > this.player.position.x
								&& playerBoundingBox.right > wall.position.x
								&& playerBoundingBox.left < wall.position.x
							) {
								newPosition.x = wall.position.x - (this.player.image.width / 2);
								positionFixed.x = true;
							}

						} else if (
							!positionFixed.y
							&& intersects.horizontally > 0
							&& intersects.horizontally > intersects.vertically
						) {
							if (
								newPosition.y < this.player.position.y
								&& playerBoundingBox.top < wall.position.y + wall.height
								&& playerBoundingBox.bottom > wall.position.y + wall.height
							) {
								newPosition.y = wall.position.y + wall.height + (this.player.image.height / 2);
								positionFixed.y = true;

							} else if (
								newPosition.y > this.player.position.y
								&& playerBoundingBox.bottom > wall.position.y
								&& playerBoundingBox.top < wall.position.y
							) {
								newPosition.y = wall.position.y - (this.player.image.height / 2);
								positionFixed.y = true;
							}
						}

						if (positionFixed.x && positionFixed.y) {
							break;
						}
					}

					this.player.position.x = newPosition.x;
					this.player.position.y = newPosition.y;
				}

				this.player.render();
				this.walls.forEach(wall => wall.render());
			}

		}

		class Player {

			constructor(context) {
				this.context = context;

				this.image = new Image();
				this.image.src = 'player.png';

				this.rotation = 0.0;
				this.position = {
					x: 200,
					y: 100,
				};
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

		class Wall {

			constructor(context, x, y, width, height) {
				this.context = context;
				this.position = {
					x,
					y,
				};
				this.width = width;
				this.height = height;
			}

			render() {
				this.context.fillStyle = '#000';
				this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
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
		directions.forEach(direction => keysPressed[direction] = false);

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
