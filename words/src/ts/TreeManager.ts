import {TreeEntry} from "./TreeEntry";

export class TreeManager {
    private _tree: TreeEntry;


    constructor() {
        this._tree = new TreeEntry(' ', undefined);
    }

    addWordToTree(word: string){
        let characters = word.split('');
        let treeElement = this._tree;
        characters.forEach(value => {
            treeElement = treeElement.getChildWitChar(value);
            treeElement.count += 1;
        })
    }

    formatTree(){
        let text = '';
        for (let char in this._tree.children){
            if(this._tree.children[char]){
                text += this._tree.children[char].printChildren(0);
            }
        }
        console.log(this._tree);
    }


    get tree(): TreeEntry {
        return this._tree;
    }
}