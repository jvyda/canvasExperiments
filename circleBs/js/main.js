var canvas;
var ctx;

var config = {
    size: {
        width: 1000,
        height: 1000
    },
    maxGesX: 10,
    maxGesY: 10,
    maxAge: 1000
};

var objects = [];

function update(obj) {
    obj.gesX += randomNumber(2);
    obj.gesY += randomNumber(2);
    obj.x += obj.gesX;
    obj.y += obj.gesY;
    obj.radius += randomNumber(2, obj.radius);

    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#' + (~~obj.col.red).toString(16) + (~~obj.col.green).toString(16) + (~~obj.col.blue).toString(16);
    ctx.stroke();
    if (obj.gesX > config.maxGesX) obj.gesX -= Math.random() * 5;
    if (obj.gesY > config.maxGesY) obj.gesY -= Math.random() * 5;
    if ((obj.x + obj.radius / 2) > config.size.width || (obj.x - obj.radius / 2) < 0) {
        obj.gesX *= -1;
    }
    if ((obj.y + obj.radius / 2) > config.size.height || (obj.y - obj.radius / 2) < 0) {
        obj.gesY *= -1;
    }
    obj.age += 1;
    if (obj.age < config.maxAge) {
        setTimeout(function () {
            update(obj);
        }, 10)
    }
}

function reset() {
    objects.forEach(function (obj) {
        obj.age = config.maxAge;
    });
    objects = [];
    ctx.beginPath();
    ctx.rect(0, 0, config.size.width, config.size.height);
    ctx.fillStyle = 'white';
    ctx.fill();
    createNewCircle();
}

function createNewCircle() {
    var obj = {
        x: Math.random() * config.size.width,
        y: Math.random() * config.size.height,
        radius: Math.random() * 20,
        gesX: 0,
        gesY: 0,
        age: 0,
        col: {
            red: (Math.random() * 255),
            green: (Math.random() * 255),
            blue: (Math.random() * 255)
        }
    };
    objects.push(obj);
    update(obj)
}
$(document).ready(function () {
    canvas = $('#canvas')[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx = canvas.getContext("2d");
    createNewCircle();
    setInterval(createNewCircle, 5000)
});
