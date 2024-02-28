import WebGL from "./three/examples/jsm/capabilities/WebGL.js";
import Game from "./objects.js";
import {announceGoal, getPositionVector, OBJECTS_Z, countdown, announcePlayers} from "./aux_functions.js";

window.game_main = function game_main(gameId, vsAI) {
	document.querySelector("#game-button").remove();

	// Check if mode tournament is on
	if(window.playing_tournament === true)
		document.querySelector("#button-return-tournament").classList.remove("no-display");

	const slug = vsAI === "True" ? `wss/game_ai/${gameId}/` : `wss/game/${gameId}/`;

	const gameSocket = new WebSocket(`ws://${window.location.host}/${slug}`);
	var game = new Game();
	var gameContainer = document.getElementById("game-container");

	var player_id = "";
	var gamestate;
	var finish = false;
	const lerpSmoothness = 0.6;
	var animation_frame;
	var frames_to_finish_render = 200;

	// Socket handling

	gameSocket.onmessage = messageHandler;

	gameSocket.onopen = function (e) {
		window.blockNavigation = true;
		document.addEventListener("keydown", keydownHandler, false);
		document.addEventListener("keyup", keyupHandler, false);
	}

	gameSocket.onclose = function (e) {
		if (e.code === 4001)
		{
			var warning = document.createElement("p");
			warning.innerText = "Looks like this game has already started, sorry!"
			warning.className = "game-error";
			document.getElementById("game-container").appendChild(warning);
		}
		window.blockNavigation = false;
		document.removeEventListener("keydown", keydownHandler);
		document.removeEventListener("keyup", keyupHandler);
		game.remove(game.pad1, game.pad2, game.ball);
		finish = true;

		// Solo se ejecuta si estamos en modo torneo
		if (window.tournament_socket !== undefined)
		{
			document.querySelector("#button-return-tournament").addEventListener("click", () => {
				window.tournament_socket.send(JSON.stringify(
					{
						info: "MATCH_ENDED",
					}
				));
				document.querySelector("#button-return-tournament").classList.add("no-display");
			});
			//Last step before leaving game, disable button 

		}

	};

	function messageHandler(event) {
		const messageData = JSON.parse(event.data);
		if (messageData.type === "gamestate_update") {
			document.getElementById("avatars").hidden = true;
			announceGoal("", finish); // this removes the goal message only if the game has not finished
			gamestate = messageData.gamestate;
			// close the socket here so the last goal gets received
			if (finish)
				gameSocket.close();
		} else if (messageData.type === "player_join") {
			player_id = messageData.player_id;
		} else if (messageData.type === "goal_msg") {
			finish = messageData.finish;
			announceGoal(messageData.player, messageData.finish);
		} else if (messageData.type === "ready") {
			announcePlayers(messageData.player1, messageData.player2, messageData.avatar1, messageData.avatar2);
			countdown("countdown", 3);
		}
	}

	// ThreeJS functions

	function animate() {
		game.renderer.setSize(gameContainer.clientWidth, gameContainer.clientHeight);
		if (gamestate && game.score.p1 != 5 && game.score.p2 != 5) {
			if (game.score.p1 != gamestate.score.p1 || game.score.p2 != gamestate.score.p2)
			{
				game.update_score(gamestate.score.p1, gamestate.score.p2);
				// dont interpolate position on goals, the animation looks strange
				game.pad1.position.set(gamestate.pad1.x, gamestate.pad1.y, OBJECTS_Z);
				game.pad2.position.set(gamestate.pad2.x, gamestate.pad2.y, OBJECTS_Z);
				game.ball.position.set(gamestate.ball.x, gamestate.ball.y, OBJECTS_Z);
			}
			else
			{
				game.pad1.position.lerp(getPositionVector(gamestate.pad1.x, gamestate.pad1.y), lerpSmoothness);
				game.pad2.position.lerp(getPositionVector(gamestate.pad2.x, gamestate.pad2.y), lerpSmoothness);
				game.ball.position.lerp(getPositionVector(gamestate.ball.x, gamestate.ball.y), lerpSmoothness);
			}
		}
		animation_frame = requestAnimationFrame(animate);
		game.composer.render(game, game.camera);
		if (finish)
		{
			frames_to_finish_render--;
			if (frames_to_finish_render == 0)
				cancelAnimationFrame(animation_frame);
		}
	}

	if (WebGL.isWebGLAvailable()) animate();
	else {
		const warning = WebGL.getWebGLErrorMessage();
		document.getElementsByName("body").appendChild(warning);
	}

	// Event listeners

	const keydownHandler = (event) => {
		if (event.repeat)
			return ;
		var name = event.key;
		if (name == "ArrowUp" || name.toLowerCase() == "w") {
			gameSocket.send(JSON.stringify({ movement: "up", player: player_id }));
		}
		if (name == "ArrowDown" || name.toLowerCase() == "s") {
			gameSocket.send(JSON.stringify({ movement: "down", player: player_id }));
		}
	};

	const keyupHandler = (event) => {
		if (event.repeat)
			return ;
		var name = event.key;
		if (name == "ArrowUp" || name.toLowerCase() == "w") {
			gameSocket.send(JSON.stringify({ movement: "", player: player_id }));
		}
		if (name == "ArrowDown" || name.toLowerCase() == "s") {
			gameSocket.send(JSON.stringify({ movement: "", player: player_id }));
		}
	};

	function onWindowResize() {
		game.renderer.setSize(window.innerWidth, (window.innerWidth / 16) * 9);
	}

	window.addEventListener("resize", onWindowResize, false);
}