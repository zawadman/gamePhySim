import * as THREE from 'three';
import { Character } from './Character';
import { Resources } from '/Util/Resources';
import * as STATE from './State.js';


export class Player extends Character {
    constructor(modelFiles) {
        super();
        //this.gameObject;
        
        this.resources = new Resources(modelFiles);
        this.init();
        // Superstate
		this.state = new STATE.GroundedState();

		// Substate
		this.substate = new STATE.IdleState();

		this.state.enterState(this);
        
    }

    async init() {
        await this.resources.loadAll();
        const modelData = this.resources.get('playerModel');
        this.model = this.setModel(modelData.scene); // Set the model
        this.gameObject.add(this.model);
        // Create the animation mixer
        this.mixer = new THREE.AnimationMixer(this.model);
    
        // If there are animations, play the first one as an example
        if (modelData.animations.length > 0) {
            const action = this.mixer.clipAction(modelData.animations[0]);
            action.play();
        }

    }
    switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	switchSubState(substate) {
		this.substate = substate;
		this.substate.enterState(this);
	}
    update(deltaTime,gameMap,controller){
        super.update(deltaTime,gameMap);
        this.state.updateState(this, controller);
    }
    
}

