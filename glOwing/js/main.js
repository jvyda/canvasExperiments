var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    glOwing: {
        vertices: 0.0007028789923526766 * (window.innerWidth * window.innerHeight),
        maxNodeDist: 80,
        interVal: 2000
    }
};

var graph = [];

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    $("#canvas").css('background-color', 'rgba(0, 0, 0, 1)');
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    generateGraph();
    interconnectGraph(graph);
    paintGraph(graph, 0, initBots);
});

function initBots(){
    setTimeout(startBot, config.glOwing.interVal);
}

function startBot(){
    var index = randomInteger(graph.length);
    bot(0, [graph[index]], {index: 1}, getColor());
/*    setTimeout(function(){
        bot(0, [graph[index]], {index: 1}, blackColor())
    }, 2000);
    */
    setTimeout(startBot, config.glOwing.interVal);
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
    if(index === graph.length - 1) {
        return;
    }
    var vertice = toChange[index];
    vertice.color = colorToSet;
    for(var i = 0; i < vertice.neighbors.length; i++){
        var verticeToChange = vertice.neighbors[i];
        if(verticeToChange.index in changed) continue;
        toChange.push(verticeToChange);
        changed[verticeToChange.index] = 1;
    }
    paintVerticeAndNeighbors(vertice);
    setTimeout(function(){
        bot(index + 1, toChange, changed, colorToSet);
    }, 1);
}


function generateGraph(){
    for(var i = 0; i < config.glOwing.vertices; i++){
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


function paintVerticeAndNeighbors(vertice) {
    ctx.beginPath();
    //ctx.rect(node.x, node.y, 1, 1);
    ctx.strokeStyle = vertice.color.styleRGB;

    for (var i = 0; i < vertice.neighbors.length; i++) {
        ctx.moveTo(vertice.x, vertice.y);
        ctx.lineTo(vertice.neighbors[i].x, vertice.neighbors[i].y);
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
        paintVerticeAndNeighbors(graph[index]);
        ctx.stroke();
    }


    requestAnimationFrame(function(){
        paintGraph(graph, index, callback)
    })
}

