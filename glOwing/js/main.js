var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    glOwing: {
        nodes: 1000,
        maxNodeDist: 100
    }
};

var graph = [];

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    generateGraph();
    interconnectGraph(graph);
    paintGraph(graph, 0, startBot);
    setInterval(startBot, 2000);
});

function startBot(){
    var index = randomInteger(graph.length);
    bot(0, [graph[index]], {index: 1}, getColor());
}


function blackColor(){
    var color = {
        r: 0, g: 0, b: 0
    };
    addRGBStyle(color);
    return color;
}

function getColor(){
    //return randomColor();
    return randomElement(rainbowColors);
}

function bot(index, toChange, changed, colorToSet){
    if(index === toChange.length) return;
    var vertice = toChange[index];
    vertice.color = colorToSet;
    for(var i = 0; i < vertice.neighbors.length; i++){
        var verticeToChange = vertice.neighbors[i];
        if(verticeToChange.index in changed) continue;
        toChange.push(verticeToChange);
        paintVerticeAndNeighbors(graph, verticeToChange.index);
        changed[verticeToChange.index] = 1;
    }
    setTimeout(function(){
        bot(index + 1, toChange, changed, colorToSet);
    }, 1);
}


function generateGraph(){
    for(var i = 0; i < config.glOwing.nodes; i++){
        var vertice = randomPoint(config.size.width, config.size.height);
        vertice.neighbors = [];
        vertice.index = i;
        vertice.color = blackColor();
        graph.push(vertice)
    }
}

function interconnectGraph(graphToConnect){
    for(var grapI = 0; grapI < graphToConnect.length; grapI++){
        var vertice = graphToConnect[grapI];
        for(var compareToGraphI = 0; compareToGraphI < graphToConnect.length; compareToGraphI++){
            var verticeToCheckWith = graphToConnect[compareToGraphI];
            if(pointDistance(vertice, verticeToCheckWith) < config.glOwing.maxNodeDist){
                verticeToCheckWith.neighbors.push(vertice);
                vertice.neighbors.push(verticeToCheckWith);
            }
        }
    }
}


var rainbowColors = createRainbowColors(1/16);


function paintVerticeAndNeighbors(graph, index) {
    var node = graph[index];
    ctx.beginPath();
    //ctx.rect(node.x, node.y, 1, 1);
    ctx.strokeStyle = node.color.styleRGB;

    for (var i = 0; i < node.neighbors.length; i++) {
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.neighbors[i].x, node.neighbors[i].y);
    }
    ctx.stroke();
}

function paintGraph(graph, index, callback){
    for(var verticeI = 0; verticeI < 20; verticeI++){
        index++;
        if(index === graph.length) {
            callback();
            return;
        }
        ctx.beginPath();
        paintVerticeAndNeighbors(graph, index);
        ctx.stroke();
    }


    requestAnimationFrame(function(){
        paintGraph(graph, index, callback)
    })
}

