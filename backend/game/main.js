import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Game from "./objects.js";

// Add event listener on keydown
document.addEventListener(
	"keydown",
	(event) => {
		var name = event.key;
		if (name == "ArrowDown") scene.pad1.moveDown();
		if (name == "ArrowUp") scene.pad1.moveUp();
		if (name == "s") scene.pad2.moveDown();
		if (name == "w") scene.pad2.moveUp();
	},
	false,
);

/* three.js variables */
let scene = new Game();
let frames = 0;
let prevTime = performance.now();

function animate() {
	requestAnimationFrame(animate);
	scene.update();
	frames++;
	const time = performance.now();
	if (time >= prevTime + 1000) {
		console.log("FPS:", Math.round((frames * 1000) / (time - prevTime)));
		prevTime = time;
		frames = 0;
	}
	scene.renderer.render(scene, scene.camera);
}

if (WebGL.isWebGLAvailable()) animate();
else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementsByName("body").appendChild(warning);
}
