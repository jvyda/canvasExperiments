import * as THREE from 'three';
import {PlanetaryObjectManager} from "./PlanetaryObjectManager";
import {Config} from "./Config";
import TrackingBallControls = require('three-trackballcontrols');
import {PlanetaryObject} from "./PlanetaryObject";
import {Moon} from "./Moon";

export class MainLoop {
    private planObjManager: PlanetaryObjectManager = new PlanetaryObjectManager();
    private _mainRenderer: THREE.WebGLRenderer;
    private _controls: any;
    private mainCamera: THREE.PerspectiveCamera;
    private _scene: THREE.Scene;

    init(){
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x000000);

        this.planObjManager.setupPlanets();
        this.planObjManager.setupMoons();
        this.planObjManager.joinToFullList();

        this._mainRenderer = new THREE.WebGLRenderer({antialias: true});
        this._mainRenderer.autoClear = false;
        this._mainRenderer.setClearColor(new THREE.Color(0x000000), 1);
        let c = Config.i();
        this._mainRenderer.setSize(c.mainDimensions.width, c.mainDimensions.height);
        this._mainRenderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(this._mainRenderer.domElement);

        this.mainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, Config.i().worldSize);
        this.mainCamera.position.x = 0;
        this.mainCamera.position.y = 0;
        this.mainCamera.position.z = 1000;
        this.mainCamera.lookAt(0, 0, 0);


        this._controls = new TrackingBallControls(this.mainCamera, this._mainRenderer.domElement);
        this._controls.zoomSpeed = 5;
        this._controls.rotateSpeed = 5;
        this._controls.panSpeed = 3;
        this._controls.staticMoving = true;

        window.addEventListener('keypress', this.keyPress);

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            let toggleMoons = document.createElement('button');
            let textNode = document.createTextNode("toggle moons");
            toggleMoons.appendChild(textNode);
            toggleMoons.style.position = 'absolute';
            toggleMoons.style.top = '20px';
            toggleMoons.style.right = '5px';
            toggleMoons.onclick = this.toggleMoons;
            document.body.appendChild(toggleMoons);

            let toggleMoonNames = document.createElement('button');
            toggleMoonNames.style.position = 'absolute';
            toggleMoonNames.style.top  = '80px';
            toggleMoonNames.style.right = '10px';
            toggleMoonNames.onclick = this.toggleMoonNames;
            let toggleMoonsTextNode = document.createTextNode("toggle moons name");
            toggleMoonNames.appendChild(toggleMoonsTextNode);
            document.body.appendChild(toggleMoonNames);

            let toggleTrails = document.createElement('button');
            toggleTrails.style.position = 'absolute';
            toggleTrails.style.top  = '120px';
            toggleTrails.style.right = '10px';
            toggleTrails.onclick = this.toggleTrails;
            let toggleTrailsText = document.createTextNode("toggle trails");
            toggleTrails.appendChild(toggleTrailsText);
            document.body.appendChild(toggleTrails);

            let resetControls = document.createElement('button');
            resetControls.style.position = 'absolute';
            resetControls.style.top  = '20px';
            resetControls.style.right = '100px';
            resetControls.onclick = this.resetControls;
            let resetControlsText = document.createTextNode("reset controls");
            resetControls.appendChild(resetControlsText);
            document.body.appendChild(resetControls);

        }
        this.setupPlanets();
    }

    setupPlanets(){
        this.planObjManager.objects.forEach(value => {
            this.createObject(value);
        });
    }

    keyPress = (event: KeyboardEvent) => {
        let keyCode = (typeof event.which == "number") ? event.which : event.keyCode;

        switch (keyCode) {
            // n -> names
            case 110:
                this.toggleMoonNames();
                break;
            // m -> moons
            case 109:
                this.toggleMoons();
                break;
            case 116:
                this.toggleTrails();
                break;
            case 114:
                this.resetControls();
                break;
        }
    };

    toggleMoonNames = () => {
        Config.i().showMoonNames = !Config.i().showMoonNames;
        this.planObjManager.moons.forEach(value => {
            value.textObj.visible = Config.i().showMoonNames;
        })
    };

    toggleMoons = () => {
        let config = Config.i();
        config.showMoons = !config.showMoons;
        this.planObjManager.moons.forEach(value => {
            value.obj.visible = Config.i().showMoons;
        });
        if(config.trailEnabled){
            this.planObjManager.objects.forEach(value => {
                this._scene.remove(value.trail);
                value.destroyTrail();
                value.setupTrail();
                this._scene.add(value.trail)
            })
        }
        if(config.showMoonNames){
            this.toggleMoonNames();
        }
    };

    toggleTrails = () => {
        Config.i().trailEnabled = !Config.i().trailEnabled;
        if(!Config.i().trailEnabled) {
            this.planObjManager.objects.forEach(value => {
                this._scene.remove(value.trail);
                value.destroyTrail();
            })
        } else {
            this.planObjManager.objects.forEach(value => {
                value.setupTrail();
                this._scene.add(value.trail)
            })
        }
    };

    resetControls = () => {
        this._controls.reset();
    };

    private createObject(object: PlanetaryObject) {
        let material = new THREE.MeshBasicMaterial({color: object.color});
        let number = Math.log(object.radius);
        console.log(`${object.name} has radius: ${number}` );
        let geometry = new THREE.SphereGeometry(Math.log(object.radius), 32, 32);
        let sphere = new THREE.Mesh(geometry, material);
        let fixedPosition = new THREE.Vector3();
        fixedPosition.copy(object.position);
        sphere.position.copy(fixedPosition);
        object.obj = sphere;
        if(object instanceof Moon){
            sphere.visible = Config.i().showMoons;
        }
        this.placeTextToPlanet(object, fixedPosition);
        if(Config.i().trailEnabled){
            object.setupTrail();
            this._scene.add(object.trail);
        }
        this._scene.add(sphere);
    }

    private placeTextToPlanet(object: PlanetaryObject, fixedPosition: THREE.Vector3) {
        let fontMat = new THREE.MeshBasicMaterial({
            color: object.color
        });

        let fontGeo = new THREE.TextGeometry(object.name, {
            font: Config.i().font,
            size: 20,
            height: 1,
            curveSegments: 12,
            bevelEnabled: false,
        });
        let textMesh = new THREE.Mesh(fontGeo, fontMat);
        textMesh.position.copy(fixedPosition);

        if(object instanceof Moon){
            textMesh.visible = Config.i().showMoonNames;
        }
        this._scene.add(textMesh);
        object.textObj = textMesh;
    }

    execute() {
        this.render();
    }



    render = () => {
        this._controls.update();
        this._mainRenderer.render(this._scene, this.mainCamera);
        this.planObjManager.objects.forEach(value => {
            let scaleVector = new THREE.Vector3();
            let scaleFactor = 4;
            let sprite = value.obj;
            let scale = scaleVector.subVectors(sprite.position, this.mainCamera.position).length() / 250 / scaleFactor;
            sprite.scale.set(scale, scale, scale);
            value.textObj.scale.set(scale, scale, scale);
        });
        // TODO very bad style, REFACTOR
        this.planObjManager.spheresAct(this._scene);
        setTimeout(() => {
            requestAnimationFrame(this.render);
        }, 1000 / Config.i().frames)

    };

}