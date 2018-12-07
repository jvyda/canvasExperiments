import {ReplacementRule, ReplacementSystem} from "./SystemManager";
import {Utils} from "./Utils";
import {Config} from "./Config";

export class SystemRuleStorage {

    static setBaseRules(obj: ReplacementRule){
        Config.alphabet.forEach(value => {
            obj[value] = value;
        });
    }

    static dragonCurve() : ReplacementSystem {
        let replacements : ReplacementRule = {};
        SystemRuleStorage.setBaseRules(replacements);
        replacements['F'] = '-F++G';
        replacements['G'] = 'F--G+';
        return {start: 'F', rules: replacements};
    }

    static randomRules(): ReplacementSystem {
        let replacements : ReplacementRule = {};
        SystemRuleStorage.setBaseRules(replacements);
        Config.alphabet.forEach(value => {
            replacements[value] =
                Utils.randomElement(Config.alphabet) +
                Utils.randomElement(Config.alphabet) +
                Utils.randomElement(Config.alphabet) +
                Utils.randomElement(Config.alphabet)
        });

        let startElement = Utils.randomElement(Config.alphabet);
        return {start: startElement, rules: replacements};
    }
}