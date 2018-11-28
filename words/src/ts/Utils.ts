export class Utils {
    static fillingChars(amount: number, char: string){
        let val = '';
        for(let i = 0; i < amount;i++){
            val += char;
        }
        return val;
    }
}