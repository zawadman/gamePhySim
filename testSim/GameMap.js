import { TileNode } from './TileNode.js';
import * as THREE from 'three';
import { MapRenderer } from './MapRenderer';
import { Graph } from './Graph';
import { VectorUtil } from '/Util/VectorUtil.js';
import { Perlin } from './Perlin.js';
import { MathUtil } from '/Util/MathUtil.js'

export class GameMap {
	
	// Constructor for our GameMap class
	constructor() {


		this.width = 500;
		this.depth = 300;
	

		this.start = new THREE.Vector3(-this.width/2,0,-this.depth/2);

		// We also need to define a tile size 
		// for our tile based map
		this.tileSize = 1;

		// Get our columns and rows based on
		// width, depth and tile size
		this.cols = this.width/this.tileSize;
		this.rows = this.depth/this.tileSize;

		// Create our graph
		// Which is an array of nodes
		this.graph = new Graph(this.tileSize, this.cols, this.rows);

		// Create our map renderer
		this.mapRenderer = new MapRenderer();



	}

	// initialize the GameMap
	init(scene) {
		this.scene = scene;
		this.graph.initGraph();

		this.applyNoise();

		this.graph.setupEdges();

		// Set the game object to our rendering
		this.gameObject = this.mapRenderer.createRendering(this);
	}


	// Method to get location from a node
	localize(node) {
		let x = this.start.x+(node.x*this.tileSize)+this.tileSize*0.5;
		let y = this.tileSize;
		let z = this.start.z+(node.z*this.tileSize)+this.tileSize*0.5;

		return new THREE.Vector3(x,y,z);
	}

	// Method to get node from a location
	quantize(location) {
		let x = Math.floor((location.x - this.start.x)/this.tileSize);
		let z = Math.floor((location.z - this.start.z)/this.tileSize);
		
		return this.graph.getNode(x,z);
	}

	applyNoise() {

		let perlin = new Perlin(50);

		this.maxElevation = 150;
		this.maxWater = Math.floor(this.maxElevation*0.45);
		this.maxSand = Math.floor(this.maxElevation*0.48);

		for (let n of this.graph.nodes) {

			// Typically good between 0.005 - 0.03
			// let e = perlin.noise(n.x, n.z, 0.001);

			let e = perlin.octaveNoise(n.x, n.z, 0.008, 50, 0.35);

			n.elevation = MathUtil.map(e, 0, 1, 0, this.maxElevation);

			if (n.elevation < this.maxWater) {
				n.elevation = this.maxWater;
				n.type = TileNode.Type.Water;

			} else if (n.elevation < this.maxSand) { //the types are changing here..
				n.type = TileNode.Type.Sand;	//initially they are all grass type
			
			} else {
				n.type = TileNode.Type.Grass;
			}
		}

	}


}


