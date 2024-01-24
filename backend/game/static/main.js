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
	requestAnimationFrame(animate);
	game.update();
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
