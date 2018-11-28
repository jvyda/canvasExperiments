import {Utils} from "./Utils";

export interface TreeEntryLink {
    [key: string]: TreeEntry;
}

export class TreeEntry {
    private _char: string;
    private _count: number;
    private _children: TreeEntryLink;
    private _parent: TreeEntry;


    constructor(char: string, parent: TreeEntry) {
        this._char = char;
        this._count = 0;
        this._children = {};
        this._parent = parent;
    }

    getChildWitChar(char: string){
        if(!this._children[char]){
            this._children[char] = new TreeEntry(char, this);
        }
        return this._children[char];
    }

    getAmountOfChildren(){
        let count = 0;
        for (let char in this.children){
            if(this.children[char]){
                count += 1;
            }
        }
        return count;
    }


    get count(): number {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
    }

    format(){
        return `${this._char}: ${this.count}`;
    }


    get char(): string {
        return this._char;
    }

    get children(): TreeEntryLink {
        return this._children;
    }

    printChildren(depth: number){
        let text = Utils.fillingChars(depth - 1, '|') + '-' + this.format();
        for (let char in this.children){
            if(this.children[char]){
                text += this.children[char].printChildren(depth + 1);
            }
        }
        return text;
    }

    testForWidth(maxAmountOfChildren: number) {
        for (let char in this.children){
            if(this.children[char]){
                let amountOfChildren = this.children[char].getAmountOfChildren();
                maxAmountOfChildren = Math.max(amountOfChildren, maxAmountOfChildren);
            }
        }
        return maxAmountOfChildren;
    }

    testForHeight(currentDepth: number){
        let height = currentDepth;
        for (let char in this.children){
            if(this.children[char]){
                 height = Math.max(height, this.children[char].testForHeight(currentDepth + 1));
            }
        }
        return height;
    }

    getTestForAmountOfElements(amount: number) {
        amount++;
        for (let char in this.children){
            if(this.children[char]){
                amount = this.children[char].getTestForAmountOfElements(amount);
            }
        }
        return amount;
    }

    constructHierarchy(){
        let element : any = {};
        element.name = this._char;
        element.children = [];
        for (let char in this.children){
            let child = this.children[char];
            if(child){
                element.children.push(child.constructHierarchy())
            }
        }
        return element;
    }

    getLowerEnvironment(){
        let hierarchy :any = {};
        hierarchy.name = this._char;
        hierarchy.children = [];
        hierarchy.parent = this._parent;
        for (let char in this.children){
            if(this.children[char]){
                let localElement = this.children[char].getLocalElement();
                localElement.link = this.children[char];
                hierarchy.children.push(localElement);
            }
        }
        return hierarchy;
    }

    getLocalElement(){
        // @ts-ignore
        return {name: this.char, value: this.count, link: undefined, parent: undefined}
    }


    get parent(): TreeEntry {
        return this._parent;
    }

    set parent(value: TreeEntry) {
        this._parent = value;
    }
}

