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
        speed: 10,
        reboundBuffChance: 0.25,
        portalChance: 0.07,
        simulationDepth: 5000,
        restartTaps: 3,
        tapsFactor: 2,
        resetTapsDecreaseInterval: 2
    },
    general: {
        fps: 30
    }
};

var mobile = 'ontouchstart' in window;


if(mobile){
    config.balls.tapsFactor = 3;
}

var timeouts = [];

var toSpawn = 0;
var spawning = false;
var newSpawnSet = false;

var mouseStart = {};
var mouseStop = {};
var animationId = {};

var balls = [];

var rects = [];
var gameOver = false;

var buffs = [];
var portals = [];
var reboundBalls = 0;
var mouseDown = false;
var newStartPoint;

var fourtyFiveDegrees = toRad(45);
var portalCounter = 1;
var oneHundredThirtyFriveDegrees = toRad(135);
var oneHundredEightyDegrees = toRad(180);

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

colors.forEach(addRGBStyle);

var restartRect = {
    x: 0, y: 0, width: config.size.width * 0.2, height: config.size.height * 0.2
};

function isInRect(point, rect){
    return point.x > rect.x && point.x < (rect.x + rect.width) && point.y > rect.y && rect.y < (rect.y + rect.height);
}

var doRestart = 0;
var restarting = false;

function setPoint(event){

    var point = getMousePos(canvas, event);
    if(isInRect(point, restartRect)){
        doRestart++;
        console.log(doRestart)
        if(doRestart >= config.balls.restartTaps * config.balls.tapsFactor){
            console.log('Restarting');
            timeouts.forEach(function(timeout){
                clearTimeout(timeout);
            });
            timeouts = [];
            restarting = true;
            rects = [];
            buffs = [];
            portals = [];
            balls = [];
            portalCounter = 1;
            config.balls.balls = 10;
            mouseDown = false;
            mouseStop = {};
            spawnStuff();
            doRestart = 0;
            // verrrrry cheap hack
            // I couldnt get the mouse events to stop, because on mobile twice as much are sent
            // so after resetting it, balls still spawned, because the event was triggered and therefore came into the lower
            // lines of code... and spawned balls
            timeouts.push(setTimeout(function(){
                restarting = false;
                spawning = false;
                console.log('reseting restarting flag...')
            }, 250));
            return;
        }
    }
    //setShaft(event)
    mouseStart = newStartPoint;
    if(spawning) return;
    if(!mouseDown){
        mouseDown = true;
        mouseStop = point;
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
        vec: vec,
        simulation: false,
        maxBounces: -1
    };
    if(!restarting) {
        balls.push(ball);
        timeouts.push(setTimeout(function(){
            if(restarting) return;
            startBall(cnt - 1);
        }, 250))
    }
}

function setShaft(event) {
    mouseStart = getMousePos(canvas, event);
}

function setTip(event) {

    toSpawn = config.balls.balls;
    startBall(config.balls.balls);
}

function updateCanvas() {
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    if(gameOver){
        ctx.fillText('gameover: ' + config.balls.balls, config.size.width / 2, config.size.height / 2);
    }

    var caseApplied = false;
    objectsToDisplay.forEach(function(object){
        if(object.startCondition()){
            caseApplied = true;
            object.running = true;
            object.applied = true;
        }
        if(object.condition() && object.running){
            caseApplied = true;
            object.fun();
            object.applied = true;
        }
        else {
            object.running = false;
            if(object.applied){
                object.postFun();
            }
            object.applied = false;
        }
    });

    if(!caseApplied){
        if(!gameOver && !restarting){
            paintRects();
            paintPortals();
            paintBuffs();
            paintBalls();
            paintIndicator();
            ballsAct();
        }
    }
    setTimeout(function () {
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.general.fps)
}

function paintPortals(){
    portals.forEach(paintPortal)
}
function paintPortal(portal){
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.rect(portal.source.xPos, portal.source.yPos, portal.source.width, portal.source.height);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'lightBlue';
    ctx.rect(portal.target.xPos, portal.target.yPos, portal.target.width, portal.target.height);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillText(portal.source.linkedWith, portal.source.xPos, portal.source.yPos + portal.source.height / 2);
    ctx.fillText(portal.target.linkedWith, portal.target.xPos, portal.target.yPos + portal.target.height / 2);
    ctx.fill();

}

var objectsToDisplay = [];
objectsToDisplay.push({
    fun: drawPlaceHolder,
    startCondition: function(){
        return rects.length == 0
    },
    condition: function(){
        return placeHolder.y > 0
    },
    applied: false,
    running: false,
    postFun: function(){
        rectsAct();
        newStartPoint = {x: balls[0].x, y: config.size.height - 25};
        balls = [];
    },
    reset: function(){
        placeHolder = {x: config.size.width / 2, y: config.size.height}
    }
});

function paintBuffs(){
    buffs.forEach(paintBuff);
}

function paintBuff(buff){
    ctx.beginPath();
    ctx.moveTo(buff.xPos, buff.yPos);
    ctx.fillStyle = buildBuffGradient(buff);
    ctx.rect(buff.xPos, buff.yPos, buff.width, buff.height);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText(buff.duration, buff.xPos + 20, buff.yPos + 20);
    ctx.stroke();
}

function paintPrediction(){
    var vec = createNormalizedVector(mouseStop, mouseStart);
    var prediction = {
        x: mouseStart.x,
        y: mouseStart.y,
        radius: 4,
        vec: vec,
        simulation: true,
        bounces: 2
    };

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(prediction.x, prediction.y);
    var cnt = 0;
    while(prediction.bounces > 0 && cnt < config.balls.simulationDepth) {
        ballAct(prediction);
        ctx.lineTo(prediction.x, prediction.y);
        cnt++;
    }
    ctx.stroke();

}

function paintIndicator(){
    ctx.beginPath();
    ctx.strokeStyle='black';
    ctx.fillStyle='black';

    if(mouseDown){
        paintPrediction();
    }
    ctx.beginPath();
    ctx.fillStyle = 'lightBlue';
    ctx.rect(0, config.size.height - 30, (balls.length / config.balls.balls) * config.size.width / 2, 10);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillText(toSpawn, 0, config.size.height - 20);
    ctx.fill();

    if(reboundBalls > 0){
        ctx.fillStyle = 'yellow';
        ctx.rect(0, config.size.height - 50, reboundBalls * 10, 10);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.fillText(reboundBalls, 0, config.size.height - 40);
        ctx.fill();
    }
}

function rectsAct(){
    rects.forEach(function(rect){
        rect.yPos += config.balls.verticalSize;
        if(rect.yPos > config.size.height - 50){
            gameOver = true;
        }
    });
    portals.forEach(function(portal, index, array){
        portal.source.yPos += config.balls.verticalSize;
        portal.target.yPos += config.balls.verticalSize;
        if(portal.source.yPos > config.size.height - 50){
            array.splice(index, 1);
            return;
        }
        if(portal.target.yPos > config.size.height - 50){
            array.splice(index, 1);
        }
    });
    buffs.forEach(function(buff, index, array){
        buff.yPos += config.balls.verticalSize;
        if(buff.yPos > config.size.height - 50){
            array.splice(index, 1);
        }
    });
    config.balls.balls++;
    toSpawn = config.balls.balls;
    spawnStuff();
    updateCookieStorage();
    spawning = false;
}

function updateCookieStorage(){
    var objectToStore = {
        rects: rects,
        balls: config.balls.balls,
        buffs: buffs,
        portals: portals
    };

    Cookies.remove('balls');
    Cookies.set('balls', objectToStore);
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
    ctx.fillStyle = 'black';
    ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
    ctx.fill();
}

function ballsAct(){
    balls.forEach(ballAct);
    newSpawnSet = false;
    if(rects.length == 0){
        objectsToDisplay[0].reset();
        return;
    }
    balls.forEach(function(ball, index, array){
        if(ball.done){
            array.splice(index, 1);
        }
        if(array.length == 0 && spawning){
            rectsAct();
        }
    });

}

var placeHolder = {x: config.size.width / 2, y: config.size.height};

function drawPlaceHolder(){
    ctx.fillText('Any idea for a better animation?', placeHolder.x, placeHolder.y);
    ctx.fill();
    placeHolder.y -= 5;
}

function ballAct(ball){
    ball.x = ball.x + ball.vec.x * config.balls.speed;
    ball.y = ball.y + ball.vec.y * config.balls.speed;

    if ((ball.x + ball.radius) > config.size.width || (ball.x - ball.radius) < 0) {
        ball.vec.x *= -1;
        if(ball.bounces > 0){
            ball.bounces--;
        }
    }

    if (ball.y - ball.radius < 0) {
        ball.vec.y *= -1;
        if(ball.bounces > 0){
            ball.bounces--;
        }
    }

    if((ball.y + ball.radius) > config.size.height && !ball.simulation) {
        if(reboundBalls <= 0){
            if(!newSpawnSet){
                newStartPoint = {x: ball.x, y: config.size.height - 25};
                newSpawnSet = true;
            }
            ball.done = true;
        }  else {
            reboundBalls--;
            ball.vec.y *= -1;
        }
    }

    var nextX = ball.x;
    var nextY = ball.y;

    var ballBottomY = nextY + ball.radius;
    var ballLeftX = nextX - ball.radius;
    var ballTopY = nextY - ball.radius;
    var ballRightX = nextX + ball.radius;

    var found = false;
    rects.forEach(function(rect, index, array){
        var topRightX = rect.xPos + rect.width;
        //var bottomRightX = rect.xPos + rect.width;
        //var bottomRightY = rect.yPos + rect.height;
        var bottomLeftY = rect.yPos + rect.height;

        if(ballLeftX < topRightX && ballRightX > rect.xPos && ballBottomY > rect.yPos && ballTopY < bottomLeftY) {
            var centerX = rect.xPos + rect.width / 2;
            var centerY = rect.yPos + rect.height / 2;
            var rectCenterToBallCenter = createNormalizedVector(ball, {x: centerX, y: centerY});
            var normalLevel = createNormalizedVector({x: centerX + 10, y: centerY}, {x: centerX, y: centerY});
            var angle = angleBetweenTwoVectors(rectCenterToBallCenter, normalLevel);
            if(angle < fourtyFiveDegrees){
                ball.vec.x *= -1;
            } else if(angle < oneHundredThirtyFriveDegrees){
                ball.vec.y *= -1;
            } else if(angle < oneHundredEightyDegrees){
                ball.vec.x *= -1;
            }
            if(ball.bounces > 0){
                ball.bounces--;
            }


            nextX = ball.x + ball.vec.x * config.balls.speed;
            nextY = ball.y + ball.vec.y * config.balls.speed;

            ballBottomY = nextY + ball.radius;
            ballLeftX = nextX - ball.radius;
            ballTopY = nextY - ball.radius;
            ballRightX = nextX + ball.radius;

            if(ballLeftX < topRightX && ballRightX > rect.xPos && ballBottomY > rect.yPos && ballTopY < bottomLeftY) {
                var centerX2 = rect.xPos + rect.width / 2;
                var centerY2 = rect.yPos + rect.height / 2;
                var rectCenterToBallCenter2 = createNormalizedVector(ball, {x: centerX2, y: centerY2});
                var normalLevel2 = createNormalizedVector({x: centerX2 + 10, y: centerY2}, {x: centerX2, y: centerY2});
                var angle2 = angleBetweenTwoVectors(rectCenterToBallCenter2, normalLevel2);

                if (angle2 < fourtyFiveDegrees) {
                    ball.vec.y *= -1;
                } else if (angle2 < oneHundredThirtyFriveDegrees) {
                    ball.vec.y *= -1;
                } else if (angle2 < oneHundredEightyDegrees) {
                    ball.vec.x *= -1;
                }
            }
            if(!ball.simulation) {
                rect.points--;
            }
            found = true;
            if(rect.points <= 0 && !ball.simulation){
                array.splice(index, 1);
            }
        } else {
            return;
        }

    });

    found = false;

    buffs.forEach(function(buff, index, array){
        if(found || buff.points == 0) return;
        var topRightX = buff.xPos + buff.width;
        //var bottomRightX = buff.xPos + buff.width;
        //var bottomRightY = buff.yPos + buff.height;
        var bottomLeftY = buff.yPos + buff.height;

        if(ballLeftX < topRightX && ballRightX > buff.xPos && ballBottomY > buff.yPos && ballTopY < bottomLeftY && !ball.simulation) {
            buff.points--;
            found = true;
            buff.effect(ball);
            array.splice(index, 1);
        } else {
            return;
        }

    });
    found = false;
    portals.forEach(function(portal, index, array){
        function portalCollision(portal, ball){
            if(found) return;
            var topRightX = portal.xPos + portal.width;
            //var bottomRightX = portal.xPos + portal.width;
            //var bottomRightY = portal.yPos + portal.height;
            var bottomLeftY = portal.yPos + portal.height;
            if(ballLeftX < topRightX && ballRightX > portal.xPos && ballBottomY > portal.yPos && ballTopY < bottomLeftY) {
                found = true;
                portal.effect(ball);
            } else {
                return;
            }
        }

        portalCollision(portal.source, ball);
        if(!found){
            portalCollision(portal.target, ball)
        }


    })
}

function spawnStuff(){
    if(Math.random() < config.balls.reboundBuffChance){
        var buff = {
            xPos: ((Math.random() * config.balls.rowElements) << 0) * config.balls.horizontalSize,
            yPos: 1 * config.balls.verticalSize,
            height: config.balls.verticalSize - 5,
            width: config.balls.horizontalSize - 5,
            duration: (Math.random() * config.balls.balls + 1) << 0,
            effect: function(ball) {
                reboundBalls += buff.duration;
            }
        };
        buffs.push(buff);
    }

    if(Math.random() < config.balls.portalChance)
    {
        var source = {
            xPos: ((Math.random() * config.balls.rowElements) << 0) * config.balls.horizontalSize,
            yPos: ((Math.random() * config.balls.rows) << 0) * config.balls.verticalSize + config.balls.verticalSize / 2 - 7.5,
            height: 15,
            width: config.balls.verticalSize - 5,
            linkedWith: portalCounter
        };
        var target = {
            xPos: ((Math.random() * config.balls.rowElements) << 0) * config.balls.horizontalSize,
            yPos: ((Math.random() * config.balls.rows) << 0) * config.balls.verticalSize + config.balls.verticalSize / 2 - 7.5,
            height: 15,
            width: config.balls.verticalSize - 5,
            linkedWith: portalCounter
        };

        portalCounter++;
        var centerX =  target.xPos + target.width / 2;
        var centerY =  target.yPos + target.height / 2;
        var base = createNormalizedVector({x: centerX, y: centerY}, {x : centerX + 10, y: centerY});
        var lowerRight = createNormalizedVector({x: centerX, y: centerY}, {x: target.xPos + target.width, y: target.yPos + target.height});
        var lowerLeft = createNormalizedVector({x: centerX, y: centerY}, {x: target.xPos, y: target.yPos + target.height});
        target.angles = [angleBetweenTwoVectors(base, lowerRight), angleBetweenTwoVectors(base, lowerLeft)];
        source.angles = [angleBetweenTwoVectors(base, lowerRight), angleBetweenTwoVectors(base, lowerLeft)];

        var blocked = false;
        if(target.yPos == source.yPos && target.xPos == source.xPos){
            blocked = true;
        }
        if(!blocked)
        blocked = blocked || overlaysRect(source);
        if(!blocked)
        blocked = blocked || overlaysBuff(source);
        if(!blocked)
        blocked = blocked || overlaysPortal(source);
        if(!blocked)
        blocked = blocked || overlaysRect(target);
        if(!blocked)
        blocked = blocked || overlaysBuff(target);
        if(!blocked)
        blocked = blocked || overlaysPortal(target);

        // orange
        source.effect = function(ball) {
           collisionWithPortal(ball, source, target);
        };

        //blue
        target.effect = function(ball) {
            collisionWithPortal(ball, target, source);
        };

        var portal = {
            source: source,
            target: target
        };
        if(!blocked){
            portals.push(portal)
        }
    }

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
        exists = exists || overlaysRect(rect);
        exists = exists || overlaysBuff(rect);
        exists = exists || overlaysPortal(rect);


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

function overlaysRect(rect){
    var exists = false;
    rects.forEach(function(rectToTest){
        if(exists) return;
        if(rectToTest.xPos == rect.xPos && rectToTest.yPos == rect.yPos){
            exists = true;
        }
    });

    return exists;
}

function overlaysBuff(rect){
    var exists = false;
    buffs.forEach(function(buffToTest){
        if(exists) return;
        if(buffToTest.xPos == rect.xPos && buffToTest.yPos == rect.yPos){
            exists = true;
        }
    });
    return exists;
}

function overlaysPortal(rect){
    var exists = false;
    portals.forEach(function (portalToTest){
        if(exists) return;
        var sourceCenter = {
            x: portalToTest.source.xPos + portalToTest.source.width / 2,
            y: portalToTest.source.yPos + portalToTest.source.height / 2
        };
        if(sourceCenter.x > rect.xPos && sourceCenter.x < (rect.xPos + rect.width) && sourceCenter.y > rect.yPos && sourceCenter.y < (rect.yPos + rect.height)){
            exists = true;
        }
        var targetCenter = {
            x: portalToTest.target.xPos + portalToTest.target.width / 2,
            y: portalToTest.target.yPos + portalToTest.target.height / 2
        };
        if(targetCenter.x > rect.xPos && targetCenter.x < (rect.xPos + rect.width) && targetCenter.y > rect.yPos && targetCenter.y < (rect.yPos + rect.height)){
            exists = true;
        }
    });

    return exists;
}

function buildBuffGradient(buff){
    var yellowMagenta = ctx.createRadialGradient(buff.xPos + buff.width / 2, buff.yPos + buff.height / 2,  0, buff.xPos + buff.width / 2, buff.yPos + buff.height / 2, buff.width / 2);
    yellowMagenta.addColorStop(0 ,"yellow");
    yellowMagenta.addColorStop(1, "DarkMagenta");
    return yellowMagenta;
}

function collisionWithPortal(ball, thisOne, partner){
    var centerX = thisOne.xPos + thisOne.width / 2;
    var centerY = thisOne.yPos + thisOne.height / 2;

    var xOffset = ball.x - thisOne.xPos;
    var yOffset = ball.y - thisOne.yPos;
    var rectCenterToBallCenter = createNormalizedVector(ball, {x: centerX, y: centerY});
    var normalLevel = createNormalizedVector({x: centerX + 10, y: centerY}, {x: centerX, y: centerY});
    var angle = angleBetweenTwoVectors(rectCenterToBallCenter, normalLevel);
    if(angle < thisOne.angles[0]){
        ball.x = partner.xPos - ball.radius;
        ball.y = partner.yPos + yOffset;
    } else if(angle < thisOne.angles[1]){
        if(ball.vec.y > 0){
            ball.y = partner.yPos + partner.height + ball.radius;
            ball.x = partner.xPos + xOffset;
        } else {
            ball.y = partner.yPos - ball.radius;
            ball.x = partner.xPos + xOffset;
        }
    } else if(angle < oneHundredEightyDegrees){
        ball.x = partner.xPos + partner.width + ball.radius;
        ball.y = partner.yPos + yOffset;
    }
}



$(document).ready(function () {
    newStartPoint = {x: config.size.width / 2, y: config.size.height - 25};
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
        if(restarting) return;
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchend", function (e) {
        if(restarting) return;
        var mouseEvent = new MouseEvent("mouseup", {
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        if(restarting) return;
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
    var possibleBalls = Cookies.getJSON('balls');
    if(possibleBalls == undefined){
        spawnStuff();
    } else {
        buffs = possibleBalls.buffs;
        portals = possibleBalls.portals;
        rects = possibleBalls.rects;

        // it doesnt store functions
        buffs.forEach(function(buff){
            buff.effect = function(ball) {
                reboundBalls += buff.duration;
            }
        });

        portals.forEach(function(portal){
            portal.source.effect = function(ball) {
                collisionWithPortal(ball, portal.source, portal.target);
            };

            //blue
            portal.target.effect = function(ball) {
                collisionWithPortal(ball, portal.target, portal.source);
            };
        });


        config.balls.balls = possibleBalls.balls;
    }
    requestAnimationFrame(updateCanvas);

    setInterval(function(){
        if(doRestart > 0){
            doRestart--;
        }
    }, config.balls.resetTapsDecreaseInterval * 1000)
});


