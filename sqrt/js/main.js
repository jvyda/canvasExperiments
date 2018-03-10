let imageData = {};
let ctx = {};
let canvas = {};

let totalAmount = 10000000;
let parts = 200;

let config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    sqrt: {
        size: window.innerHeight / 2 - 100,
        controlSize: 100,
        digitIncr: 2 * Math.PI / totalAmount,
        parts: parts,
        partSize: totalAmount / parts,
    }
};

let points = {};

let center = {
    x: config.size.width / 2,
    y: config.size.height / 2
};


function fillPoints() {
    let increment = 2 * Math.PI / 10;
    let currentAngle = 0;

    for (let i = 0; i < 10; i++) {
        currentAngle = currentAngle + increment;
        points[i] = {
            angle: currentAngle, color: rainbow[(i * 10) << 0]
        }
    }
}

// results in 101 different colors
let rainbow = createRainbowColors(1 / 16, 255);

function getPointInAngle(angle, centerToBaseOf, distance) {
    return {x: centerToBaseOf.x + distance * Math.cos(angle), y: centerToBaseOf.y + distance * Math.sin(angle)}
}

function paintLayout() {
    let startPoint = getPointInAngle(points[0].angle, center, config.sqrt.size);
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < 10; i++) {
        let newPnt = getPointInAngle(points[i].angle, center, config.sqrt.size);
        ctx.lineTo(newPnt.x, newPnt.y);
        //ctx.fillText(i, newPnt.x, newPnt.y)
    }
    ctx.lineTo(startPoint.x, startPoint.y);
    ctx.stroke();
}

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    console.log('START', new Date());
    fillPoints();
    paintLayout();
    loadPartAndRender(0, undefined);
});

function loadPartAndRender(part, latestPoint){
    loadNumbers(part).then(function (numberText) {
        if(numberText.indexOf('ERROR') !== -1){
            console.log('ERROR OUT OF BOUNDS');
            return;
        }
        let numbers = numberText.replace('.', '').split('');
        if(!latestPoint) {
            latestPoint = {};
            latestPoint.point = getPointInAngle(points[numbers[0]].angle, center, config.sqrt.size);
            latestPoint.control = getPointInAngle(points[numbers[0]].angle, center, config.sqrt.controlSize);
        }
        connectNumber(numbers, latestPoint, part, 0);

    }).catch(function (err) {
        console.log(err)
    });
}


function connectNumber(numbers, latestPoint, part, stackSize) {
    if (numbers.length === 0) {
        part++;
        if(part < config.sqrt.parts){
            loadPartAndRender(part, latestPoint);
        } else {
            console.log('DONE', new Date())
        }
        return;
    }
    let digit = numbers.splice(0, 1);
    let angle = points[digit];
    let point = getPointInAngle(angle.angle, center, config.sqrt.size);
    let newCtrlPoint = getPointInAngle(angle.angle, center, config.sqrt.controlSize);
    ctx.beginPath();
    ctx.moveTo(latestPoint.point.x, latestPoint.point.y);
    ctx.strokeStyle = angle.color.styleRGB;
    ctx.bezierCurveTo(latestPoint.control.x, latestPoint.control.y, newCtrlPoint.x, newCtrlPoint.y, point.x, point.y);
    ctx.stroke();
    points[digit].angle += config.sqrt.digitIncr;
    latestPoint.point = point;
    latestPoint.control = newCtrlPoint;
    stackSize++;
    if(stackSize > 5000){
        requestAnimationFrame(function(){
            connectNumber(numbers, latestPoint, part, 0)
        })
    } else {
        connectNumber(numbers, latestPoint, part, stackSize);
    }
}


function loadNumbers(part) {
    return new Promise(function (resolve, reject) {
        let client = new XMLHttpRequest();
        //client.open('GET', 'sqrt2.10mil.txt');
        client.open('GET', 'http://localhost:5000/?start=' + part * config.sqrt.partSize + '&length=' + config.sqrt.partSize);
        client.onload = function () {
            resolve(client.responseText);
        };
        client.onerror = function () {
            reject('error')
        };
        client.send();
    })

}

