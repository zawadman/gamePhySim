import { Player } from './Player.js';
import * as THREE from 'three';

export class State {
	

	// Creating an abstract class in JS
	// Ensuring enterState and updateState are implemented
	constructor() {
	
	    if(this.constructor == State) {
	       throw new Error("Class is of abstract type and cannot be instantiated");
	    };

	    if(this.enterState == undefined) {
	        throw new Error("enterState method must be implemented");
	    };

	     if(this.updateState == undefined) {
	        throw new Error("updateState method must be implemented");
	    };
	
	}
  
}


export class IdleState extends State {

	enterState(player) {
		player.velocity.x = 0;
		player.velocity.z = 0;
		console.log("Idle");
	}

	updateState(player, controller) {
		if (controller.moving()) {
			player.switchSubState(new MovingState());
		}
	}

}



export class MovingState extends State {

	enterState(player) {
		console.log("Moving");
	}

	updateState(player, controller) {

		let xzVelocity = player.velocity.clone();
		xzVelocity.y = 0;
		if (!controller.moving()) {
			player.switchSubState(new IdleState());
		} else {
			let force = controller.direction();
			force.setLength(50);
			player.applyForce(force);
		
		}	
	}
  
}


export class GroundedState extends State {

	enterState(player) {
		console.log("Grounded");
		player.velocity.y = 0;
		player.isJumping =false;
		player.substate.enterState(player);
		//player.update()
	}

	updateState(player, controller) {
		if (controller.jumping()) {
			player.switchState(new JumpingState());
		}
		player.substate.updateState(player, controller);
	}

}

export class JumpingState extends State {

	enterState(player) {
		console.log("Jumping");

		let force = new THREE.Vector3(0,500,0);
		//player.physics();
		
		player.applyForce(force);
		player.isJumping=true;

		player.substate.enterState(player);
		//player.update();
	}

	updateState(player, controller) {
		if ((player.location.y <= player.node.elevation) && !controller.jumping()) {
			player.switchState(new GroundedState());
		}
		player.substate.updateState(player, controller);
	}

}

















