import {PlanetaryObject} from "./PlanetaryObject";
import {Config} from "./Config";

export class OtherObject extends PlanetaryObject {
    constructor(mass: number, name: string, radius: number) {
        super(mass, name, radius);
        this.minSize = 2;
    }


    public fillTrail(thisPosition: THREE.Vector3, scene: THREE.Scene): void {
        if(Config.i().showMoons){
            super.fillTrail(thisPosition, scene);
        }
    }
}