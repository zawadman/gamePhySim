import * as THREE from 'three';

export class Controller {
	// Controller Constructor
	constructor(doc) {
		this.doc = doc;
		this.left = false;
		this.right = false;
		this.forward = false;
		this.backward = false;
		this.jump = false;

		this.doc.addEventListener('keydown', this);
		this.doc.addEventListener('keyup', this);
	}

	handleEvent(event) {
		const key = event.key.toUpperCase();
		if (event.type == 'keydown') {
			switch (key) {
				case("U"): 
					this.forward = true;
					break;
				case("J"):
					this.backward = true;
					break;
				case("H"):
					this.left = true;
					break;
				case("K"):
					this.right = true;
					break;
				case(" "):
					this.jump = true;
					break;
			}
	
		}
		else if (event.type == 'keyup') {
			switch (key) {
				case("U"): 
					this.forward = false;
					break;
				case("J"):
					this.backward = false;
					break;
				case("H"):
					this.left = false;
					break;
				case("K"):
					this.right = false;
					break;
				case(" "):
					this.jump = false;
					break;
			}
		}
	}
	
	destroy() {
		this.doc.removeEventListener('keydown', this);
		this.doc.removeEventListener('keyup', this);
	}

	moving() {
		if (this.left || this.right || this.forward || this.backward)
			return true;
		return false;
	}

	jumping() {
		if (this.jump)
			return true;
		return false;
	}

	direction() {
		let direction = new THREE.Vector3();

		if (this.left) {
			direction.x = -1;
		}
		if (this.right) {
			direction.x = 1;
		}

		if (this.forward) {
			direction.z = -1;
		}
		if (this.backward) {
			direction.z = 1;
		}


		return direction;
	}


}