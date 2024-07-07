import * as THREE from 'three';
import { GameMap } from './GameMap';
import { CamControls } from './CamControls';
import  { Player } from './Player'
import { Controller } from './Controller'

// Create Scene
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();

const clock = new THREE.Clock();

const controller = new Controller(document);



//perspective camera
const freeCam = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
freeCam.position.set(0,100,0);
freeCam.lookAt(100, 10, 0);

// Create GameMap
const gameMap = new GameMap();
const camControls = new CamControls(freeCam,document.body);

//player
const modelFiles = [
    {name: 'playerModel', url: 'stickFig.glb'}
];
const player = new Player(modelFiles);


// Setup our scene
function setup() {

	scene.background = new THREE.Color(0xffffff);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.needsUpdate = true;
	document.body.appendChild(renderer.domElement);

	const geometry = new THREE.BoxGeometry(10,10,10);
	const material = new THREE.MeshStandardMaterial({ color: 0x00fff0 });
	const cube = new THREE.Mesh(geometry, material);
	cube.castShadow = true;  // Enable shadow casting for the mesh
	//cube.receiveShadow = true;  // Enable shadow receiving for the mesh
	cube.position.set(-10,80,15);
	scene.add(cube);


	//Create Light
	let light = new THREE.PointLight( 0xffffff, 29000, 1000 );
	light.castShadow =true;
	light.position.set(60, 200, 15);

	let lightSphereGeometry = new THREE.SphereGeometry(10, 16, 16);
    let lightSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    let lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);

    // // Make the sphere a child of the light
    light.add(lightSphere);

	scene.add(light);

	//player.gameObject.position.set(0,50,0);

	// initialize our gameMap
	gameMap.init(scene);
	scene.add(gameMap.gameObject);
	scene.add(player.gameObject);
    scene.add(freeCam);

	animate();


	//First call to animate

}


// animate
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // Assuming you have a clock defined

    if (player.mixer) {
        player.mixer.update(delta);
    }
	player.update(delta, gameMap,controller);

    camControls.update();
    renderer.render(scene, freeCam);
}



setup();