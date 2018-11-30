export class Utils {
    static degToRad(deg: number){
        return deg * Math.PI / 180;
    }

    static randomElement(array: any){
        return array[(Math.random() * array.length << 0)];
    }
}