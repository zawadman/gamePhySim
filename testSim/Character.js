import * as THREE from 'three';
//import { CollisionDetector } from './CollisionDetector.js';
import { VectorUtil } from './Util/VectorUtil.js';

export class Character {

	// Character Constructor
	constructor(mColor) {
		this.size = 3;
        	

		// Initialize movement variables
		this.location = new THREE.Vector3(0,0,0);
		this.velocity = new THREE.Vector3(0,0,0);
		this.acceleration = new THREE.Vector3(0, 0, 0);

		this.gameObject = new THREE.Group();

		this.topSpeed = 15;
		this.mass = 1;
		this.maxForce = 15;

		this.frictionMagnitude = 0;

		this.wanderAngle = null;
	}

	// update character
	update(deltaTime, gameMap) {
		this.gameMap=gameMap;
		this.node = this.gameMap.quantize(this.location);
		this.physics();
		this.velocity.addScaledVector(this.acceleration, deltaTime);
		
		// update velocity via acceleration
		if (this.velocity.length() > 0) {

			// rotate the character to ensure they face 
			// the direction of movement
			if (this.velocity.x != 0 || this.velocity.z != 0) {
				let angle = Math.atan2(this.velocity.x, this.velocity.z);
				this.gameObject.rotation.y = angle;
			}
			
			let xzVelocity = this.velocity.clone();
			xzVelocity.y = 0
			if (xzVelocity.length() > this.topSpeed) {
				xzVelocity.setLength(this.topSpeed);
				this.velocity.x = xzVelocity.x;
				this.velocity.z = xzVelocity.z;

			} 


			// update location via velocity
			this.location.addScaledVector(this.velocity, deltaTime);
			
		}
		
		this.checkEdges();
		this.location.y = this.node.elevation+this.velocity.y;
		//this.applyForce(this.velocity);
		this.gameObject.position.set(this.location.x,this.location.y, this.location.z);
		this.acceleration.multiplyScalar(0);
	
	}
	physics() {

		// friction
		let friction = this.velocity.clone();
		friction.y = 0;
		friction.multiplyScalar(-1);
		friction.normalize();
		friction.multiplyScalar(this.frictionMagnitude);
		this.applyForce(friction)

		// gravity
		if (this.location.y <= this.node.elevation) {
			//console.log('anti grav');
			this.velocity.y = 0;
		} else if (this.location.y > this.node.elevation){
			console.log("grav working");
			let gravity = new THREE.Vector3(0,-10,0);
			this.applyForce(gravity);
			
		}
		
	
	}
	// check we are within the bounds of the world
	checkEdges() {
       
        if (this.location.x < -this.edge_x) {
            this.location.x = this.edge_x;
        } 
   
        if (this.location.z < -this.edge_z) {
            this.location.z = this.edge_z;
        }
   
        if (this.location.x > this.edge_x) {
            this.location.x = -this.edge_x;
        }
 
        if (this.location.z > this.edge_z) {
            this.location.z = -this.edge_z;
        }
    }

	// Apply force to our character
	applyForce(force) {
		//this.physics();
		// here, we are saying force = force/mass
		force.divideScalar(this.mass);
		// this is acceleration + force/mass
		this.acceleration.add(force);
	}

	// Seek steering behaviour
	seek(target) {
		let desired = new THREE.Vector3();
		desired.subVectors(target, this.location);
		desired.setLength(this.topSpeed);

		let steer = new THREE.Vector3();
		steer.subVectors(desired, this.velocity);

		if (steer.length() > this.maxForce) {
			steer.setLength(this.maxForce);
		}
		return steer;
	}

	// Wander steering behaviour
  	wander() {
  		let d = 10;
  		let r = 10;
  		let a = 0.3;

  		let futureLocation = this.velocity.clone();
  		futureLocation.setLength(d);
  		futureLocation.add(this.location);



  		if (this.wanderAngle == null) {
  			this.wanderAngle = Math.random() * (Math.PI*2);
  		} else {
  			let change = Math.random() * (a*2) - a;
  			this.wanderAngle = this.wanderAngle + change;
  		}

  		let target = new THREE.Vector3(r*Math.sin(this.wanderAngle), 0, r*Math.cos(this.wanderAngle));
  		target.add(futureLocation);
  		return this.seek(target);

  	}

	  setModel(model) {
		//model.position.set(0,this.node.elevation,0);
		model.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
			}
		});
		
		
		// Bounding box for the object
		var bbox = new THREE.Box3().setFromObject(model);
		
		// Get the depth of the object for avoiding collisions
		// Of course we could use a bounding box,
		// but for now we will just use one dimension as "size"
		// (this would work better if the model is square)
		let dz = bbox.max.z-bbox.min.z;
		
		// Scale the object based on how
		// large we want it to be
		let scale = this.size/dz;
		model.scale.set(scale/2, scale/2, scale/2);
		
		//model.castShadow =true;
		//model.recieveShadow=true;
        //this.gameObject = new THREE.Group();
        //this.gameObject.add(model);
		return model;
    }


	// getCollisionPoint(obstaclePosition, obstacleRadius, prediction) {

	// 	// Get the vector between obstacle position and current location
	// 	let vectorA = VectorUtil.sub(obstaclePosition, this.location);
	// 	// Get the vector between prediction and current location
	// 	let vectorB = VectorUtil.sub(prediction, this.location);

	// 	// find the vector projection
	// 	// this method projects vectorProjection (vectorA) onto vectorB 
	// 	// and sets vectorProjection to the its result
	// 	let vectorProjection = VectorUtil.projectOnVector(vectorA, vectorB);
	// 	vectorProjection.add(this.location);
		

	// 	// get the adjacent using trigonometry
	// 	let opp = obstaclePosition.distanceTo(vectorProjection);
	// 	let adj = Math.sqrt((obstacleRadius*obstacleRadius) - (opp*opp));
		
	// 	// use scalar projection to get the collision length
	// 	let scalarProjection = vectorProjection.distanceTo(this.location);
	// 	let collisionLength = scalarProjection - adj;

	// 	// find the collision point by setting
	// 	// velocity to the collision length
	// 	// then adding the current location
	// 	let collisionPoint = VectorUtil.setLength(this.velocity, collisionLength);
	// 	collisionPoint.add(this.location);

		
	// 	return collisionPoint;
	// }
	// avoidCollision(obstaclePosition, obstacleRadius, time) {

	// 	let steer = this.wander();

	// 	let prediction = VectorUtil.multiplyScalar(this.velocity, time);
	// 	prediction.add(this.location);
			
	// 	let collision = CollisionDetector.lineCircle(this.location, prediction, obstaclePosition, obstacleRadius);
	// 	//console.log(collision);


	// 	if (collision) {
	// 		let collisionPoint = this.getCollisionPoint(obstaclePosition,obstacleRadius,prediction);


	// 		let normal  = VectorUtil.sub(collisionPoint, obstaclePosition);
	// 		normal.setLength(205);

	// 		let target = VectorUtil.add(collisionPoint, normal);

			
	// 		steer = this.seek(target);
			

	// 	}
        
	// 	return steer;

	// }



}