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
	<?php $unique = uniqid(); ?>
	<script type="application/javascript" src="Game.js?v=<?=$unique; ?>"></script>
	<script type="application/javascript" src="Playground.js?v=<?=$unique; ?>"></script>
	<script type="application/javascript" src="Player.js?v=<?=$unique; ?>"></script>
	<script type="application/javascript" src="Ball.js?v=<?=$unique; ?>"></script>
	<script type="application/javascript" src="Wall.js?v=<?=$unique; ?>"></script>
	<script type="application/javascript">
		const game = new Game(document, document.getElementById('canvas'), 600, 600);
		game.render();

		/*
		vybíjená:
		- refaktoring (hráč by neměl znát svý controls)
		- různé barvy hráčů
		- online hraní
		- pohyb na základě času, ne rychlosti animace
		- přepočítání pixelů dle velikosti okna
		- loadery znázorňovat spíš barvou hráče
		- mrtvola bez krve
		- zvuky
		- kolize rohu zdi a kruhu
		- odrážení míče od hráčů? (možná je ale lepší hratlnost když se to neodráží)
		 */
	</script>
</html>
