import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js'
import Game from './objects.js';

function create_background(game) {
	let geometry = new THREE.BoxGeometry(game.width, game.height, 1);
	let material = new THREE.MeshBasicMaterial( { color: 0xFFaa00 } );
	let cube = new THREE.Mesh(geometry, material);
	cube.position.set(game.width / 2, game.height / 2, 0);
	return cube;
}

function create_ball(ball) {
	let geometry = new THREE.SphereGeometry( 4, 32, 16 ); 
	let material = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 
	let sphere = new THREE.Mesh( geometry, material ); 
	sphere.position.set(ball.pos.x, ball.pos.y, 1);
	return sphere;
}

function create_paddle(paddle) {
	let geometry = new THREE.BoxGeometry(paddle.width, paddle.height, 1);
	let material = new THREE.MeshBasicMaterial( { color: paddle.color } );
	let cube = new THREE.Mesh(geometry, material);
	cube.position.set(paddle.pos.x, paddle.pos.y, 0.1);
	return cube;
}

class GameScene extends THREE.Scene {
	constructor () {
		super();
		this.game = new Game();
		this.width = this.game.width;
		this.height = this.game.height;
		this.renderer = new THREE.WebGLRenderer();
		this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 1000);
		this.camera.position.set(this.width / 2, this.height / 2, 500);
		this.render();
	}
	render() {
		this.renderer.setSize(this.width, this.height);
		// esta clase es la escena, asi que podemos hacer this.add de elementos
		this.sphere = create_ball(this.game.ball); 
		this.paddle1 = create_paddle(this.game.paddle1);
		this.paddle2 = create_paddle(this.game.paddle2);
		this.background = create_background(this.game);
		this.add(this.sphere);
		this.add(this.paddle1);
		this.add(this.paddle2);
		this.add(this.background);
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

function animate()
{
	requestAnimationFrame(animate);
	scene.update();
	scene.renderer.render((scene), scene.camera);
}

if (WebGL.isWebGLAvailable())
	animate();
else
{
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementsByName("body").appendChild(warning);
}
