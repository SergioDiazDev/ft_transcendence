/* game logic */

import * as THREE from "./three/build/three.module.min.js";
import { EffectComposer } from "./three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "./three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "./three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "./three/examples/jsm/postprocessing/OutputPass.js";


const GAME_WIDTH = 100;
const GAME_HEIGHT = height_aspect_ratio(GAME_WIDTH);

const OBJECTS_Z = 0;

const PAD_H = GAME_HEIGHT / 5;
const PAD_W = GAME_WIDTH / 100;
const BALL_SIZE = GAME_WIDTH / 100;

const WALL_HEIGHT = 1;

const MAX_SCORE = 5;

const PLAYER_COLORS = {
	mindaro: 0xe2ef70,
	verdigris: 0x16bac5,
	jade: 0x00a878,
	golden_gate: 0xeb4511,
	pear: 0xd1d646,
	sunset: 0xffcb77,
	aqua: 0x42f2f7,
	persian_blue: 0x072ac8,
	emerald: 0x48bf84,
}

const COLORS = {
	white: 0xf8f9fa,
	purple: 0x7858dc,
	pink: 0xc3a5ec,
	space_cadet: 0x202646,
};

function half(value) {
	return value / 2.0;
}

function height_aspect_ratio(width) {
	return (width / 16) * 9;
}

function random_choice(object) {
	var keys = Object.keys(object);
	var index = Math.floor(Math.random() * keys.length);
	return object[keys[index]];
}

class Paddle extends THREE.Mesh {
	constructor(color) {
		var capsule_length = PAD_H - PAD_W * 3;
		super(
			new THREE.CapsuleGeometry(PAD_W, capsule_length, 3, 10),
			new THREE.MeshStandardMaterial({color: color}),
		);
		this.rect_light = new THREE.RectAreaLight(color, 5, PAD_W, PAD_H);
		this.rect_light.position.set(half(PAD_W), 0, OBJECTS_Z + 1);
		this.rect_light.lookAt(0, 0, 0);
			/*
		if (index == 2)
			this.rotateZ(Math.PI);
			*/
		this.add(this.rect_light);
		this.position.set(0, 0, -100);
	}
}

class Ball extends THREE.Mesh {
	constructor() {
		const radius = BALL_SIZE;
		super(
			new THREE.SphereGeometry(radius, 32, 16),
			new THREE.MeshPhongMaterial({ color: COLORS.pink, shininess: 100}),
		);
		this.light = new THREE.PointLight(COLORS.purple, 60, 10);
		this.light.position.set(0, 0, OBJECTS_Z + 0.5);
		this.add(this.light);
		this.position.set(0, 0, -100);
	}
}

class Wall extends THREE.Mesh {
	constructor(width, height) {
		super(
			new THREE.BoxGeometry(width, height, 1),
			new THREE.MeshStandardMaterial({ color: COLORS.purple }),
		);
		const rect_light = new THREE.RectAreaLight(COLORS.space_cadet, 50, width, height);
		rect_light.position.set(0, 0, 0.5);
		rect_light.lookAt(0, 0, 0);
		this.add(rect_light);
	}
}

class Board extends THREE.Group {
	constructor() {
		super();
		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(GAME_WIDTH, GAME_HEIGHT),
			new THREE.MeshStandardMaterial({
				color: COLORS.space_cadet,
				roughness: 0.1,
				metalness: 0.8,
			}),
		);
		floor.position.set(half(GAME_WIDTH), half(GAME_HEIGHT), 0);
		this.top_wall = new Wall(GAME_WIDTH, WALL_HEIGHT);
		this.top_wall.position.set(
			half(GAME_WIDTH),
			GAME_HEIGHT + WALL_HEIGHT,
			0,
		);
		this.bot_wall = new Wall(GAME_WIDTH, WALL_HEIGHT);
		this.bot_wall.position.set(half(GAME_WIDTH), 0 - WALL_HEIGHT, 0);
		this.midfield = new Wall(WALL_HEIGHT / 4, GAME_HEIGHT * 1.05);
		this.midfield.position.set(half(GAME_WIDTH), half(GAME_HEIGHT), -0.5);
		this.add(floor);
		this.add(new THREE.AmbientLight(COLORS.white, 0.4));
		this.add(this.top_wall);
		this.add(this.bot_wall);
		this.add(this.midfield);
	}
}

class Game extends THREE.Scene {
	constructor() {
		super();
		this.score = {p1: NaN, p2: NaN};
		this.width = GAME_WIDTH;
		this.height = GAME_HEIGHT;
		this.board = new Board();
		this.pad1 = new Paddle(PLAYER_COLORS.aqua);
		this.pad2 = new Paddle(PLAYER_COLORS.pear);
		this.ball = new Ball();
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.toneMapping = THREE.ReinhardToneMapping;
		this.camera = new THREE.PerspectiveCamera(40, this.width / this.height);
		this.camera.position.set(half(this.width), half(this.height), 100);
		this.render();
	}
	render() {
		this.renderer.setSize(
			window.innerWidth,
			height_aspect_ratio(window.innerWidth),
		);
		this.add(this.ball);
		this.add(this.pad1);
		this.add(this.pad2);
		this.add(this.board);
		this.renderer.domElement.setAttribute("id", "game");
		document.getElementById("game-container").appendChild(this.renderer.domElement);
		// Neon style effect
		const renderScene = new RenderPass(this, this.camera);
		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(
				window.innerWidth,
				height_aspect_ratio(window.innerWidth),
			),
		);
		bloomPass.threshold = 0.1;
		bloomPass.strength = 0.1;
		bloomPass.radius = 0.1;

		const outputPass = new OutputPass();

		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(renderScene);
		this.composer.addPass(bloomPass);
		this.composer.addPass(outputPass);
		this.renderer.toneMappingExposure = 16;
	}
	update_score(p1, p2) {
		this.score.p1 = p1;
		this.score.p2 = p2;
		if (this.score.p1 == MAX_SCORE - 1 && this.score.p2 == MAX_SCORE - 1)
		{
			document.getElementById("score").innerText = "MATCH POINT";
		}
		else {
			document.getElementById("score").innerText = `${this.score.p1}\u00A0\u00A0${this.score.p2}`;
		}
	}
}

export default Game;