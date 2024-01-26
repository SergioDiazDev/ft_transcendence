import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Game from "./objects.js";

function onWindowResize(){
    game.renderer.setSize( window.innerWidth, window.innerWidth / 16 * 9 );
}
window.addEventListener("resize", onWindowResize, false);

const OBJECTS_Z = 0;
const lerpSmoothness = 0.6;

let game = new Game();

function getPositionVector(x, y)
{
	return new THREE.Vector3(x, y, OBJECTS_Z);
}

function animate() {
	if (gamestate && game.score.p1 != 5 && game.score.p2 != 5)
	{
		if (game.score.p1 != gamestate.score.p1 || game.score.p2 != gamestate.score.p2)
		{
			game.score.p1 = gamestate.score.p1;
			game.score.p2 = gamestate.score.p2;
			game.update_score();
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
