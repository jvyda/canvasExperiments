import {TreeEntry} from "./TreeEntry";
import * as d3 from 'd3';

export abstract class TreeRenderer {
    abstract render(tree: TreeEntry): void;
}

export class D3Renderer extends TreeRenderer {

    private chars : string[] = [];

    constructor() {
        super();
    }

    render(tree: TreeEntry): void {
        let data = tree.getLowerEnvironment();
       this.fillWithelement(data)
    }

    updateDisplay(){
        document.getElementById('current').innerText = JSON.stringify(this.chars);
    }

    private fillWithelement(data: any) {
        var treeLayout = d3.tree()
            .size([window.innerWidth - 50, window.innerHeight - 50]);
        if(data.children.length < 1){
            return;
        }
        var newRootData = d3.hierarchy(data);

        treeLayout(newRootData);

        d3.select("svg g.nodes").selectAll("*").remove();
        d3.select("svg g.links").selectAll("*").remove();
        let nodeappender = d3.select('svg g.nodes')
            .selectAll('circle.node')
            .data(newRootData.children)
            .enter();

        let childBeh = (d:any) => {
            console.log('child')
            let elemen = d.data.link;
            this.fillWithelement(elemen.getLowerEnvironment());
        };

        let parentBeh = (d:any) => {
            console.log('parent')
            this.chars.splice(this.chars.length - 2, 2);
            let elemen = d.data.parent;
            this.fillWithelement(elemen.getLowerEnvironment());
        };

        this.chars.push(data.name);

        let rootAppender = d3.select('svg g.nodes')
            .selectAll('circle.node')
            .data(newRootData.ancestors())
            .enter();

        rootAppender
            .append('circle')

            .classed('node', true)
            // @ts-ignore
            .attr('cx', function (d) { return d.x;
            })
            // @ts-ignore
            .attr('cy', function (d) { return d.y;
            })
            .attr('r', 4)
            .on('click',  parentBeh);

        rootAppender.append("text")
        // @ts-ignore
            .attr("dx", function(d){return d.x - 15})
            // @ts-ignore
            .attr("dy", function(d){return d.y + 15})
            //@ts-ignore
            .text(function(d){console.log(d); return d.data.name});


        nodeappender
            .append('circle')

            .classed('node', true)
            // @ts-ignore
            .attr('cx', function (d) { return d.x;
            })
            // @ts-ignore
            .attr('cy', function (d) { return d.y;
            })
            .attr('r', 4)
            .on('click',  childBeh);

        nodeappender.append("text")
            // @ts-ignore
            .attr("dx", function(d){return d.x - 15})
            // @ts-ignore
            .attr("dy", function(d){return d.y + 10})
            //@ts-ignore
            .text(function(d){return d.data.name});

// Links
        d3.select('svg g.links')
            .selectAll('line.link')
            .data(newRootData.links())
            .enter()
            .append('line')
            .classed('link', true)
            // @ts-ignore
            .attr('x1', function (d) {                return d.source.x;
            })
            // @ts-ignore
            .attr('y1', function (d) {                return d.source.y;
            })
            // @ts-ignore
            .attr('x2', function (d) {                return d.target.x;
            })
            // @ts-ignore
            .attr('y2', function (d) {                return d.target.y;
            });

        this.updateDisplay();
    }
}