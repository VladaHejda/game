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
		- kdo měl míč naposled, nemůže ho mít znova
		- stiskem mezerníku se začne "rozpřahovat", čím déle se rozpřahuje, tím dále dostřelí (má to maximum, když ho přežene, nevystřelí vůbec, maximum chvilku bliká)
		- může držet míc max např. 5 vtěřin, pak ho automaticky pustí (např. kousek směrem dozadu)
		- míč se odráží od zdí, tím ztrácí rychlost, když se zastaví, změní barvu (aby to bylo poznat) a další hráč ho může sebrat
		- hráč může (odražením) vybít sám sebe
		 */
	</script>
</html>
