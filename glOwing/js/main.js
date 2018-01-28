var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    glOwing: {
        maxNeighbors: 2,
        nodes: 1000,
        maxArcDelta: toRad(10),
        maxFurtherDist: 150
    }
};

var graph = [];

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    generateGraph();
    paintGraph(graph, 0);
});

var globalStart;

function generateGraph(){
    var start = createNode();
    globalStart = start;
    graph.push(start);
    requestAnimationFrame(function(){
        addLevels(toRad(0), [{before: start, node: start}]);
    })
}

var buildId = 0;
var paintId = 0;

var rainbowColors = createRainbowColors(1/16);

function addLevels(arc, addOnTo){
    if(addOnTo.length === 0) {
        console.log(buildId);
        return;
    }
    var newAddOnTo = [];
    for(var addI = 0; addI < addOnTo.length; addI++){
        var nodeToDo = addOnTo[addI];
        var neighbors = randomInteger(config.glOwing.maxNeighbors) + 2;
        for(var i = 0; i < neighbors; i++){
            var arcDelta2 = config.glOwing.maxArcDelta * Math.random() - config.glOwing.maxArcDelta / 2;
            var newNode = generateNodeInArcOfNode({x: 0, y: 0}, arc, 0);
            translate(newNode, nodeToDo.node);
            ctx.beginPath();
            ctx.strokeStyle = randomColor().styleRGB;
            ctx.moveTo(nodeToDo.node.x, nodeToDo.node.y);
            ctx.lineTo(newNode.x, newNode.y);
            buildId++;
            ctx.stroke();
            newNode.neighbors.push(nodeToDo.before);
            graph.push(newNode);
            nodeToDo.before.neighbors.push(newNode);
            if(graph.length < config.glOwing.nodes){
                newAddOnTo.push({before: nodeToDo.node, node: newNode});
            }
        }
    }

    var arcDelta = config.glOwing.maxArcDelta * Math.random() - config.glOwing.maxArcDelta / 2;
    if(arc > toDeg(60) && false) {
        arc -= config.glOwing.maxArcDelta * Math.random();
    }
    if(arc < toDeg(0) && false){
        arc += config.glOwing.maxArcDelta * Math.random();
    }
    var newArc = arc +  config.glOwing.maxArcDelta / 2;
    requestAnimationFrame(function(){
            addLevels(newArc, newAddOnTo);
    })
}

function generateNodeInArcOfNode(baseNode, arc, arcDelta){
    var newNode = createNode();
    var coord = getPoint(baseNode, arc + arcDelta, randomInteger(config.glOwing.maxFurtherDist));
    newNode.x = coord.x;
    newNode.y = coord.y;
    newNode.neighbors = [];
    return newNode;
}

function createNode(){
    return {x: 10, y: 10, neighbors: []}
}


function paintGraph(graph, index){
    if(index === graph.length) {
        console.log(paintId);
        return;
    }
    var node = graph[index];
    index++;
    ctx.beginPath();
    ctx.strokeStyle = randomColor().styleRGB;
    //ctx.rect(node.x, node.y, 1, 1);

    for(var i = 0; i < node.neighbors.length; i++){
        ctx.moveTo(node.x, node.y);
        paintId++;
        ctx.lineTo(node.neighbors[i].x, node.neighbors[i].y);
    }
    ctx.stroke();
    requestAnimationFrame(function(){
        paintGraph(graph, index)
    })
}

