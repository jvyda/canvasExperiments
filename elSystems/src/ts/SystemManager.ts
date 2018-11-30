import {Config} from "./Config";

export interface ReplacementRule {
    [rules: string] : string;
}

export interface ReplacementSystem {
    start: string;
    rules: ReplacementRule;
}

export class SystemManager {
    private _rules: ReplacementRule = {};
    private _sequences: string[][] = [];


    constructor() {
    }

    tick(){
        let sequence = this._sequences[this._sequences.length - 1];
        let before = sequence.slice();
        let newSequence : string[] = [];
        before.forEach(value => {
            newSequence = newSequence.concat(this._rules[value].split(''))
        });
        this._sequences.push(newSequence);
    }

    addRule(char: string, replacement: string){
        this._rules[char] = replacement;
    }

    setToSystem(system: ReplacementSystem){
        this._sequences = [];
        this._rules = {};
        this.sequences.push(system.start.split(''));
        for (let character in system.rules) {
            this.addRule(character, system.rules[character]);
        }

        let element = document.getElementById('rules');
        let text = '';
        for (let character in system.rules) {
            text += '"' + character +'" -> "' + system.rules[character] + '" ,';
        }
        element.innerHTML = 'Start: ' + system.start + ' rules: ' + text + ' angle: ' + Config.angle;
    }

    getReplacementSystem(){
        return {start: this._sequences[0], rules: this._rules};
    }

    set rules(value: ReplacementRule) {
        this._rules = value;
    }

    get sequences(): string[][] {
        return this._sequences;
    }

    resetSequences(){
        let start = this._sequences[0];
        this._sequences = [start];
    }
}