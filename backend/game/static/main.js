import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Game from "./objects.js";

function onWindowResize(){
    game.renderer.setSize( window.innerWidth, window.innerWidth / 16 * 9 );
}

window.addEventListener("resize", onWindowResize, false);

/* three.js variables */
let game = new Game();

let frames = 0;
let prevTime = performance.now();

function animate() {
	if (gamestate)
	{
		game.score.p1 = gamestate.score.p1;
		game.score.p2 = gamestate.score.p2;
		game.pad1.position.set(gamestate.pad1.x, gamestate.pad1.y, 1);
		game.pad2.position.set(gamestate.pad2.x, gamestate.pad2.y, 1);
		game.ball.position.set(gamestate.ball.x, gamestate.ball.y, 1);
		game.update_score();
	}
	requestAnimationFrame(animate);
	frames++;
	const time = performance.now();
	if (time >= prevTime + 1000) {
		console.log("FPS:", Math.round((frames * 1000) / (time - prevTime)));
		prevTime = time;
		frames = 0;
	}
	game.composer.render(game, game.camera);
}

if (WebGL.isWebGLAvailable()) animate();
else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementsByName("body").appendChild(warning);
}
