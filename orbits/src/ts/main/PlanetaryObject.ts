import * as THREE from 'three';
import {Constants} from "./Contants";
import {Config} from "./Config";
import {Moon} from "./Moon";

export abstract class PlanetaryObject {
    private _position : THREE.Vector3 = new THREE.Vector3();
    private _velocity: THREE.Vector3 = new THREE.Vector3();
    private _mass: number;
    private _name: string;
    private _radius: number;
    private _color: THREE.Color;
    private _currentForce: THREE.Vector3 = new THREE.Vector3();
    private _obj: THREE.Mesh;
    private _textObj: THREE.Mesh;
    private _minSize: number;
    private _trail: THREE.LineSegments;
    private numberOfPoints: number;
    private positions: Float32Array;



    constructor(mass: number, name: string, radius: number) {
        this._mass = mass;
        this._name = name;
        this._radius = radius;
    }

    public setupTrail() {
        if(this.trail){
            this.destroyTrail();
        }
        this.numberOfPoints = 0;
        let geometry = new THREE.BufferGeometry();

        this.positions = new Float32Array(Config.i().maxTrailPoints * 3); // 3 vertices per point
        geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));

        let drawCount = 5000;

        let material = new THREE.LineBasicMaterial({color: this.color});
        geometry.setDrawRange(1, drawCount);
        this._trail = new THREE.Line(geometry, material);
        this._trail.frustumCulled = false;
        geometry.dispose();
        material.dispose();
    }

    public destroyTrail() {
        this.trail.geometry.dispose();
        this.trail.material.dispose();
    }

    getAttraction(other: PlanetaryObject){
        let distance = this.position.distanceTo(other.position);
        if(distance == 0) return undefined;
        let d = new THREE.Vector3().subVectors(other.position, this.position);
        let force = Constants.gravitationalConstant * other.mass * this.mass / (distance * distance * distance);
        return new THREE.Vector3(d.x * force, d.y * force, d.z * force);
    }

    updateForce(allObjects: Array<PlanetaryObject>){
        let totalForce = new THREE.Vector3();
        for (let sphereI = 0; sphereI < allObjects.length; sphereI++) {
            if(allObjects[sphereI].name === this.name){
                continue;
            }
            let forces = this.getAttraction(allObjects[sphereI]);
            if (forces) {
                totalForce.x += forces.x;
                totalForce.y += forces.y;
                totalForce.z += forces.z;
            }
        }
        this.currentForce.copy(totalForce);
    }

    updatePosition() {
        let thisPosition = this.position.clone();
        thisPosition.divideScalar(475045557);
        this.obj.position.copy(thisPosition);
        if(this._textObj){
            let textPosition = this.obj.position.clone();
            textPosition.add(new THREE.Vector3(1, 1, 0));
            this._textObj.position.copy(textPosition);
        }

    }

    public fillTrail(thisPosition: THREE.Vector3, scene: THREE.Scene) {
        if(Config.i().trailEnabled){
            this.positions[this.numberOfPoints++] = thisPosition.x;
            this.positions[this.numberOfPoints++] = thisPosition.y;
            this.positions[this.numberOfPoints++] = thisPosition.z;
            // @ts-ignore:
            this.trail.geometry.attributes.position.needsUpdate = true;
            // @ts-ignore:
            this.trail.geometry.setDrawRange(0, this.numberOfPoints / 3);
            if(this.numberOfPoints > Config.i().maxTrailPoints){
                scene.remove(this.trail);
                this.destroyTrail();
                this.setupTrail();
                scene.add(this.trail);
            }
        }

    }

    reactToForce(timeStep: number, scene: THREE.Scene){
        this.velocity.x += this.currentForce.x / this.mass * timeStep;
        this.velocity.y += this.currentForce.y / this.mass * timeStep;
        this.velocity.z += this.currentForce.z / this.mass * timeStep;

        this.position.x += this.velocity.x * timeStep;
        this.position.y += this.velocity.y * timeStep;
        this.position.z += this.velocity.z * timeStep;
        this.updatePosition();
        this.fillTrail(this.obj.position, scene);
    }

    get position(): THREE.Vector3 {
        return this._position;
    }

    get mass(): number {
        return this._mass;
    }

    get name(): string {
        return this._name;
    }

    get radius(): number {
        return this._radius;
    }

    set position(value: THREE.Vector3) {
        this._position = value;
    }

    get velocity(): THREE.Vector3 {
        return this._velocity;
    }

    set velocity(value: THREE.Vector3) {
        this._velocity = value;
    }

    get color(): THREE.Color {
        return this._color;
    }

    set color(value: THREE.Color) {
        this._color = value;
    }

    get currentForce(): THREE.Vector3 {
        return this._currentForce;
    }

    set currentForce(value: THREE.Vector3) {
        this._currentForce = value;
    }


    get obj(): THREE.Mesh {
        return this._obj;
    }

    set obj(value: THREE.Mesh) {
        this._obj = value;
    }


    get textObj(): THREE.Mesh {
        return this._textObj;
    }

    set textObj(value: THREE.Mesh) {
        this._textObj = value;
    }


    get minSize(): number {
        return this._minSize;
    }

    set minSize(value: number) {
        this._minSize = value;
    }


    get trail(): THREE.LineSegments {
        return this._trail;
    }
}