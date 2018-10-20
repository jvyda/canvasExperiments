
import * as THREE from 'three';

export class Config {

    public mainDimensions : THREE.Vector2;
    public frames: number;
    public timeStep: number;
    public font: THREE.Font;
    public worldSize: number;
    public showMoonNames: boolean;
    public showMoons: boolean;
    public maxTrailPoints: number;
    public trailEnabled: boolean;

    public reconfigureSizeRelatedConfigurations() {
        this.mainDimensions = new THREE.Vector2(window.innerWidth, window.innerHeight);
    }

    reconfigureConfig() {
        this.frames = 60;
        this.timeStep = 1 * 3600;
        this.worldSize = 50000;
        this.showMoonNames = false;
        this.showMoons = true;
        this.maxTrailPoints = 50000;
        this.trailEnabled = false;
    }

    protected constructor() {
        this.reconfigureSizeRelatedConfigurations();
        this.reconfigureConfig();
    }

    private static instance: Config;

    public static i() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}