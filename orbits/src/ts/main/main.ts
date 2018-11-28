import {MainLoop} from "./MainLoop";
import {Config} from "./Config";
import * as THREE from 'three';

window.onload = function(){
    let loop = new MainLoop();
    var loader = new THREE.FontLoader();
    loader.load( 'res/fonts/helvetiker_regular.typeface.json', function ( font:any ) {

        Config.i().font = font;
        loop.init();
        loop.execute();
    })

};