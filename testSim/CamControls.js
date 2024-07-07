import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class CamControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.controls = new PointerLockControls(camera, domElement);
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        // Movement flags
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('click', () => {
            this.controls.lock();
        });

        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.moveForward = true; break;
            case 'KeyS': this.moveBackward = true; break;
            case 'KeyA': this.moveLeft = true; break;
            case 'KeyD': this.moveRight = true; break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.moveForward = false; break;
            case 'KeyS': this.moveBackward = false; break;
            case 'KeyA': this.moveLeft = false; break;
            case 'KeyD': this.moveRight = false; break;
        }
    }

    update() {
        if (this.controls.isLocked === true) {
            this.velocity.x -= this.velocity.x * 10.0 * 0.05;
            this.velocity.z -= this.velocity.z * 10.0 * 0.05;
            this.velocity.y -= this.velocity.y * 2.0 * 0.05;
        
            // Get the camera's forward vector (direction it's facing)
            const cameraForward = new THREE.Vector3();
            this.camera.getWorldDirection(cameraForward);


    

    
            // Combine the forward and right vectors based on input
            this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
            this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
            this.direction.y =  cameraForward.y ;
        
            if (this.moveLeft || this.moveRight) {
              this.velocity.add(this.direction.multiplyScalar(300.0 * 0.05 * -1));
            }
            else if (this.moveForward ){
                this.camera.position.y -= this.velocity.y * 0.05;
                this.velocity.add(this.direction.multiplyScalar(200.0 * 0.05 * -1));
            }else if (this.moveBackward){
                this.camera.position.y += this.velocity.y * 0.05;
                this.velocity.add(this.direction.multiplyScalar(200.0 * 0.05 * -1));
            }
        
            this.controls.moveRight(-this.velocity.x * 0.05);
            this.controls.moveForward((-this.velocity.z) * 0.05);
    
        }
    }
    
}

export default CamControls;
