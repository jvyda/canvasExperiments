
export class RandomUtil {
    static roundedRandom(maxValue:number){
        return (Math.random() * maxValue) << 0;
    }

    static randomElement(list: Array<any>){
        return list[RandomUtil.roundedRandom(list.length)];
    }

    static valueInRange(range: Range){
        return range.low + RandomUtil.roundedRandom(range.high - range.low);
    }

    static spliceRandomElement(list: Array<any>){
        return list.splice(RandomUtil.roundedRandom(list.length), 1)[0];
    }


}

export class Range {
    private _low: number;
    private _high:number;


    constructor(low: number, high: number) {
        this._low = low;
        this._high = high;
    }

    get low(): number {
        return this._low;
    }

    set low(value: number) {
        this._low = value;
    }

    get high(): number {
        return this._high;
    }

    set high(value: number) {
        this._high = value;
    }
}