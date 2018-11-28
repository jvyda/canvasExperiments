import {TreeManager} from "./TreeManager";
import {WordLoader} from "./WordLoader";
import {Config} from "./Config";
import {D3Renderer, TreeRenderer} from "./TreeRenderer";

export class MainLoop {
    execute() {
        let treeBuilder = new TreeManager();
        let promises = this.loadParts(treeBuilder);
        Promise.all(promises).then(value => {
            treeBuilder.formatTree();
            let renderer = new D3Renderer();
            renderer.render(treeBuilder.tree);
        });
    }

    private loadParts(treeManager: TreeManager) {
        let parts = 10;
        let loader = new WordLoader(Config.getInstance().folderName);
        let promises = [];
        for(let i = 0; i < parts; i++){
            promises.push(this.loadPartAndAdd(i, treeManager, loader));
        }
        return promises;
    }

    private loadPartAndAdd(part: number, treeManager: TreeManager, loader: WordLoader) {
        return loader.loadPart(part).then(value => {
            let split:Array<string> = value.split('\n');
            split.forEach(value => {
                treeManager.addWordToTree(value);
            })
        });
    }

}