import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const geometry = new THREE.TorusGeometry(2, 1, 12, 48);
const material = new THREE.MeshPhongMaterial({ color: 0xeeaa00 });
const light = new THREE.PointLight(0xffffff, 5, 10000, 1);
const donut = new THREE.Mesh(geometry, material);

scene.background = new THREE.Color(0xcccccc)
light.position.set(0, 5, 5);
scene.add(light);
scene.add(donut);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate()
{
	requestAnimationFrame(animate);
	donut.rotation.x += 0.005;
	donut.rotation.y += 0.01;
	renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable())
	animate();
else
{
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementsByName("body").appendChild(warning);
}
