import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

/**
 * 
 * The purpose of this class is to load 
 * resources into your three.js project
 * 
 * Resources can be accessed through a dictionary "dict"
 * 
 */
export class Resources {

    constructor(files) {

        this.files = files;

        this.dict = {};

        this.gltfLoader = new GLTFLoader();
        this.fbxLoader = new FBXLoader();
        
        
    }

    get(string) {
        const item = this.dict[string];
        if (item && item.scene && item.scene.clone) {
            // Cloning the scene if possible
            return {
                scene: item.scene.clone(true), // Deep clone
                animations: item.animations // Animations don't need cloning, they are reused
            };
        } else {
            // Return null or some error handling if the item or clone is not available
            console.error('Item not found or cannot be cloned:', string);
            return null;
        }
    }
    

    // Loads all specified resources via their URLs
    async loadAll() {
        let promises = []
        
        this.files.forEach((file) => {
            
            let promise = this.load(
                file.name, 
                file.url
            ).then(([name, data]) => {
                console.log(name);
                console.log(data);
                this.dict[name] = data;
            });
            
            promises.push(promise);
        });

        return Promise.all(promises);
    }

    // Method for loading either glb or fbx files
    // by their given extension
    load(name, url) {
        let ext = url.substring(url.length-3, url.length);
        return ((ext == "glb") || (ext == "gltf")) ? this.loadGLTF(name, url) : this.loadFBX(name, url);

    }

    // Load GLB or GLTF files
    loadGLTF(name, url) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(url, (gltf) => {
                const animations = gltf.animations;
                const scene = gltf.scene;
                resolve([name, { scene, animations }]);
            }, null, reject);
        });
    }

    // Load FBX files
    loadFBX(name, url) {
        return new Promise((resolve, reject) => {
            this.fbxLoader.load(url, data=> resolve([name, data]), null, reject);
        });
    }

    

}

