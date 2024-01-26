import WebGL from "three/addons/capabilities/WebGL.js";
import Game from "./objects.js";
import {announceGoal, getPositionVector, OBJECTS_Z} from "./aux_functions.js";

const lerpSmoothness = 0.6;

const gameId = location.href.split("/")[4] ? location.href.split("/")[4] : "error";
const gameSocket = new WebSocket(`ws://${window.location.host}/wss/game/${gameId}/`);
var game = new Game();
var gameContainer = document.getElementById("game-container");

var player_id = "";
var gamestate;
var finish = false;

// Socket handling

gameSocket.onmessage = messageHandler;

gameSocket.onopen = function (e) {
	document.addEventListener("keydown", keydownHandler, false);
	document.addEventListener("keyup", keyupHandler, false);
}

gameSocket.onclose = function (e) {
	document.removeEventListener("keydown", keydownHandler);
	document.removeEventListener("keyup", keyupHandler);
	game.remove(game.pad1, game.pad2, game.ball);
};

function messageHandler(event) {
	const messageData = JSON.parse(event.data);
	if (messageData.type === "gamestate_update") {
		announceGoal("", finish);
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
		// TODO: implement countdown message
		console.log("Game ready, 5 seconds to start");
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
	requestAnimationFrame(animate);
	game.composer.render(game, game.camera);
}

if (WebGL.isWebGLAvailable()) animate();
else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementsByName("body").appendChild(warning);
}

// Event listeners

const keydownHandler = (event) => {
    var name = event.key;
    if (name == "ArrowUp" || name == "w") {
        gameSocket.send(JSON.stringify({ movement: "up", player: player_id }));
    }
    if (name == "ArrowDown" || name == "s") {
        gameSocket.send(JSON.stringify({ movement: "down", player: player_id }));
    }
};

const keyupHandler = (event) => {
    var name = event.key;
    if (name == "ArrowUp" || name == "w") {
        gameSocket.send(JSON.stringify({ movement: "", player: player_id }));
    }
    if (name == "ArrowDown" || name == "s") {
        gameSocket.send(JSON.stringify({ movement: "", player: player_id }));
    }
};

function onWindowResize() {
	game.renderer.setSize(window.innerWidth, (window.innerWidth / 16) * 9);
}

window.addEventListener("resize", onWindowResize, false);