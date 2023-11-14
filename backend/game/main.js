import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js'
import Game from './objects.js';

function create_background(game) {
	let geometry = new THREE.PlaneGeometry(game.width, game.height);
	let material = new THREE.MeshStandardMaterial(
			{ color: 0x202646, roughness: 0.1, metalness: 0}
		);
	let cube = new THREE.Mesh(geometry, material);
	cube.position.set(game.width / 2, game.height / 2, 0);
	return cube;
}

function create_ball(ball) {
	let geometry = new THREE.SphereGeometry(ball.size, ball.size * 3, 16 ); 
	let material = new THREE.MeshStandardMaterial( { color: 0xffffff} ); 
	let sphere = new THREE.Mesh( geometry, material ); 
	sphere.position.set(ball.pos.x, ball.pos.y, 5);
	return sphere;
}

function create_paddle(paddle) {
	let geometry = new THREE.CapsuleGeometry(paddle.width, paddle.height - paddle.width, 2, 10);
	let material = new THREE.MeshPhongMaterial( { color: paddle.color, shininess: 80 } );
	let cube = new THREE.Mesh(geometry, material);
	cube.position.set(paddle.pos.x, paddle.pos.y, 5);
	return cube;
}

function create_light() {
	let light = new THREE.PointLight( 0xffffff, 1, 1000, 0);
	return light;
}

class GameScene extends THREE.Scene {
	constructor () {
		super();
		this.game = new Game();
		this.width = this.game.width * 10;
		this.height = this.game.height * 10;
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.camera = new THREE.PerspectiveCamera(40, this.game.width / this.game.height, 0.1, 1000);
		this.camera.position.set(this.game.width / 2, this.game.height / 2, 100);
		this.render();
	}
	render() {
		this.renderer.setSize(this.width, this.height);
		// esta clase es la escena, asi que podemos hacer this.add de elementos
		this.sphere = create_ball(this.game.ball); 
		this.paddle1 = create_paddle(this.game.paddle1);
		this.paddle2 = create_paddle(this.game.paddle2);
		this.background = create_background(this.game);
		this.light = create_light();
		this.light.position.set(this.game.width / 2, this.game.height / 2, 100);
		this.light.target = this.sphere;
		this.add(this.sphere);
		this.add(this.paddle1);
		this.add(this.paddle2);
		this.add(this.background);
		this.add(this.light);
		document.body.appendChild(this.renderer.domElement);
	}
	update() {
		this.game.update();
		this.sphere.position.x = this.game.ball_pos.x;
		this.sphere.position.y = this.game.ball_pos.y;
		this.paddle1.position.x = this.game.paddle1.pos.x;
		this.paddle1.position.y = this.game.paddle1.pos.y;
		this.paddle2.position.x = this.game.paddle2.pos.x;
		this.paddle2.position.y = this.game.paddle2.pos.y;
	}
}

// Add event listener on keydown
document.addEventListener('keydown', (event) => {
  var name = event.key;
	if (name == "ArrowDown")
		scene.game.paddle2.moveDown();
	else if (name == "ArrowUp")
		scene.game.paddle2.moveUp();
	else if (name == "s")
		scene.game.paddle1.moveDown();
	else if (name == "w")
		scene.game.paddle1.moveUp();
}, false);

/* three.js variables */
let scene = new GameScene();
let frames = 0;
let prevTime = performance.now();

function animate()
{
	requestAnimationFrame(animate);
	scene.update();
	frames++;
	const time = performance.now();
	if (time >= prevTime + 1000) 
	{
		console.log("FPS:", Math.round((frames * 1000) / (time - prevTime)));
		prevTime = time;
		frames = 0;
	}
	scene.renderer.render(scene, scene.camera);
}

if (WebGL.isWebGLAvailable())
	animate();
else
{
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementsByName("body").appendChild(warning);
}
