import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { TileNode } from './TileNode.js';
import { Perlin } from './Perlin.js';

export class MapRenderer {


	constructor() {

		this.water = new THREE.Color(0x1D97C1);
		this.grass = new THREE.Color(0x136d15);
		this.sand = new THREE.Color(0xF6E4AD);
	
	}


	getColor(node) {
		if (node.type == TileNode.Type.Water) {
			return this.water;
		} else if (node.type == TileNode.Type.Sand) {	
			return this.sand;
		} else {
			return this.grass;
		}
	}

	getColorGradient(node, gameMap) {
		if (node.type == TileNode.Type.Water) {
			return this.water;
		} else if (node.type == TileNode.Type.Grass) {
			return this.grass;
		} else {
			let thresh = 1;
			let diff = Math.abs(gameMap.maxWater - node.elevation)
			if (diff < thresh) {
				return new THREE.Color().lerpColors(this.water, this.sand, diff/thresh);
			}
			diff = Math.abs(gameMap.maxSand - node.elevation);
			if (diff < thresh) {
				return new THREE.Color().lerpColors(this.grass, this.sand, diff/thresh);
			}
			return this.sand;
		} 

	}

	createRendering(gameMap) {
        let cols = gameMap.cols - 1;
        let rows = gameMap.rows - 1;

        // Init plane for drawing our gameMap
        let geometry = new THREE.PlaneGeometry(cols, rows, cols, rows);
        let material = new THREE.MeshStandardMaterial({
            vertexColors: true,
        });

        let positions = geometry.attributes.position.array;
        let len = positions.length;
        let colors = [];

        for (let i = 2; i < len; i += 3) {
            let x = positions[i - 2];
            let y = positions[i - 1];
            let node = gameMap.quantize(new THREE.Vector3(x, 0, -y));
            positions[i] = node.elevation;

            let col = this.getColor(node);
            // let col = this.getColorGradient(node, gameMap);
            colors.push(col.r, col.g, col.b);
        }

        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

        let plane = new THREE.Mesh(geometry, material);
        plane.rotateX(-Math.PI / 2);
        plane.receiveShadow = true;

    

        return plane;
    }




}