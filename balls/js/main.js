var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    balls: {
        rowElements: window.innerWidth/(window.innerHeight/10),
        rows: 10,
        horizontalSize: window.innerHeight / 10,
        verticalSize: window.innerHeight / 10,
        balls: 10,
        speed: 10
    },
    general: {
        fps: 30
    }
};

var toSpawn = 0;
var spawning = false;
var newSpawnSet = false;

var mouseStart = {};
var mouseStop = {};
var animationId = {};

var balls = [];

var rects = [];
var mouseDown = false;

var colors = [
    {
        r: 0xf2, g: 0x69, b: 0x12
    }, {
        r: 0xf3, g: 0x8c, b: 0x14
    }, {
        r: 0xf4, g: 0xaf, b: 0x16
    }, {
        r: 0xf4, g: 0xd1, b: 0x17
    }, {
        r: 0xf5, g: 0xf3, b: 0x19
    }, {
        r: 0xd7, g: 0xf6, b: 0x1b
    }, {
        r: 0xb7, g: 0xf6, b: 0x1d
    }, {
        r: 0x98, g: 0xf7, b: 0x1f
    }, {
        r: 0x79, g: 0xf8, b: 0x21
    }, {
        r: 0x5a, g: 0xf8, b: 0x23
    }
];

colors.forEach(addRGBStyle)

function setPoint(event){
    if(spawning) return;
    if(mouseDown == false){
        mouseDown = true;
        //setShaft(event)
    } else {
        mouseDown = false;
        spawning = true;
        setTip(event);
    }
}

function startBall(cnt){
    toSpawn = cnt;
    if(cnt == 0) return;
    var vec = createNormalizedVector(mouseStop, mouseStart);
    var ball = {
        x: mouseStart.x,
        y: mouseStart.y,
        radius: 4,
        vec: vec
    };
    balls.push(ball);
    setTimeout(function(){
        startBall(cnt - 1);
    }, 250)
}

function setShaft(event) {
    mouseStart = getMousePos(canvas, event);
}

function setTip(event) {

    //mouseStop = getMousePos(canvas, event);
    toSpawn = config.balls.balls;
    startBall(config.balls.balls);
}

function updateCanvas() {
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    ballsAct();
    paintBalls();
    paintRects();
    paintIndicator();
    setTimeout(function () {
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.general.fps)
}

function paintIndicator(){
    ctx.beginPath();
    ctx.strokeStyle='black';
    ctx.fillStyle='black';

    if(mouseDown){
        ctx.moveTo(mouseStart.x, mouseStart.y);
        ctx.lineTo(mouseStop.x, mouseStop.y);
        ctx.stroke();
    }
    ctx.fillText(toSpawn, 0, config.size.height - 20);
    ctx.stroke();
}

function rectsAct(){
    rects.forEach(function(rect){
        rect.yPos += config.balls.verticalSize;
    });
    config.balls.balls++;
    toSpawn = config.balls.balls;
    addSomeRects();
    spawning = false;
}

function paintBalls(){
    balls.forEach(paintBall)
}

function paintRects(){
    rects.forEach(paintRect)
}

function paintRect(rect){
    ctx.beginPath();
    ctx.strokeStyle="#ffffff";
    var col = getColor(rect.points, rect.maxPoints);
    if(col == undefined){
        ctx.fillStyle = 'white'
    } else {
        ctx.fillStyle = col.styleRGB;
    }
    ctx.rect(rect.xPos, rect.yPos, rect.width, rect.height);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText(rect.points, rect.xPos + 20, rect.yPos + 20);
    ctx.stroke();
}

function getColor(value, maxValue){
    var percent = value / maxValue;
    return colors[(colors.length * percent - 1)<<0];
}

function paintBall(ball){
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
    ctx.fill();
}

function ballsAct(){
    balls.forEach(ballAct);
    newSpawnSet = false;
    if(rects.length == 0){
        rectsAct();
        mouseStart = {x: balls[0].x, y: config.size.height - 25};
        balls = [];
        return;
    }
    balls.forEach(function(ball, index, array){
        if(ball.done){
            array.splice(index, 1);
        }
    });

    if(balls.length == 0 && spawning){
        rectsAct();
    }
}

function ballAct(ball){
    ball.x = ball.x + ball.vec.x * config.balls.speed;
    ball.y = ball.y + ball.vec.y * config.balls.speed;

    if ((ball.x + ball.radius) > config.size.width || (ball.x - ball.radius) < 0) {
        ball.vec.x *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.vec.y *= -1;
    }

    if((ball.y + ball.radius) > config.size.height) {
        if(!newSpawnSet){
            mouseStart = {x: ball.x, y: config.size.height - 25};
            newSpawnSet = true;
        }
        ball.done = true
    }

    var nextX = ball.x;
    var nextY = ball.y;

    var ballBottomY = nextY + ball.radius;
    var ballLeftX = nextX - ball.radius;
    var ballTopY = nextY - ball.radius;
    var ballRightX = nextX + ball.radius;

    var found = false;
    rects.forEach(function(rect, index, array){
        if(found || rect.points == 0) return;
        var topRightX = rect.xPos + rect.width;
        //var bottomRightX = rect.xPos + rect.width;
        //var bottomRightY = rect.yPos + rect.height;
        var bottomLeftY = rect.yPos + rect.height;

        if(ballLeftX < topRightX && ballRightX > rect.xPos && ballBottomY > rect.yPos && ballTopY < bottomLeftY) {
            if(ballLeftX - ball.radius < rect.xPos){
                ball.vec.x *= -1;
            } else if(ballTopY - ball.radius < rect.yPos){
                ball.vec.y *= -1;
            } else if(ballRightX + ball.radius > topRightX){
                ball.vec.x *= -1;
            } else if(ballBottomY + ball.radius > bottomLeftY){
                ball.vec.y *= -1;
            } else if(pointDistance(ball, {x: rect.xPos, y: rect.yPos}) < 15 ||
                pointDistance(ball, {x: rect.xPos, y: bottomLeftY}) < 15 ||
                pointDistance(ball, {x: topRightX, y: rect.yPos}) < 15||
                pointDistance(ball, {x: topRightX, y: bottomLeftY}) < 15) {
                ball.vec.x *= -1;
                ball.vec.y *= -1;
                console.log('edge case')
            } else {
                console.log('__rect__')
                console.log(rect.xPos)
                console.log(rect.yPos)
                console.log(rect.height)
                console.log(rect.width)
                console.log('__ball__')
                console.log(ball.x)
                console.log(ball.y)
                console.log(ball.radius)
            }
            rect.points--;
            found = true;
            if(rect.points <= 0){
                array.splice(index, 1);
            }
        } else {
            return;
        }

    })
}

function addSomeRects(){
    var rectAmount = ((Math.random() * 9) << 0) + 1;
    for(var i = 0; i < rectAmount; i++){
        var rect = {
            xPos: ((Math.random() * config.balls.rowElements) << 0) * config.balls.horizontalSize,
            yPos: 1 * config.balls.verticalSize,
            height: config.balls.verticalSize - 5,
            width: config.balls.horizontalSize - 5,
            points: config.balls.balls,
            maxPoints: config.balls.balls
        };
        var exists = false;
        rects.forEach(function(rectToTest){
            if(exists) return;
            if(rectToTest.xPos == rect.xPos && rectToTest.yPos == rect.yPos){
                exists = true;
            }
        });
        if(!exists){
            rects.push(rect);
        }
    }
}

function setEndPoint(event){
    if(mouseDown){
        mouseStop = getMousePos(canvas, event);
    }
}

$(document).ready(function () {
    mouseStart = {x: config.size.width / 2, y: config.size.height - 25}
    toSpawn = config.balls.balls;
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    canvas.addEventListener("mousedown", setPoint, false);
    canvas.addEventListener("mouseup", setPoint, false);
    canvas.addEventListener("mousemove", setEndPoint, false);
    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];

        mousePos = getTouchPos(canvas, e);
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

// Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }
    addSomeRects();
    requestAnimationFrame(updateCanvas);
});


