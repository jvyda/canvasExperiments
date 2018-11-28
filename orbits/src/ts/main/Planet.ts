import * as THREE from 'three';
import {PlanetaryObject} from "./PlanetaryObject";


export class Planet extends PlanetaryObject {


    constructor(mass: number, name: string, radius: number) {
        super(mass, name, radius);
        this.minSize = 10;
    }


    public fillTrail(thisPosition: THREE.Vector3, scene: THREE.Scene): void {
        super.fillTrail(thisPosition, scene);
    }
}