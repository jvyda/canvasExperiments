var canvas;
var ctx;

var config = {
    size: {
        width: 1000,
        height: 1000
    },
    circleBs: {
        maxAge: 1000
    }
};

var objects = [];

function update(obj) {
    obj.deltaX += randomNumber(2);
    obj.deltaY += randomNumber(2);
    obj.x += obj.deltaX;
    obj.y += obj.deltaY;
    obj.radius += randomNumber(2, obj.radius);

    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = obj.col;
    ctx.stroke();
    if (obj.deltaX > obj.radius) obj.deltaX -= Math.random() * 2;
    if (obj.deltaY > obj.radius) obj.deltaY -= Math.random() * 2;
    if ((obj.x + obj.radius) > config.size.width || (obj.x - obj.radius) < 0) {
        obj.deltaX *= -1;
    }
    if ((obj.y + obj.radius) > config.size.height || (obj.y - obj.radius) < 0) {
        obj.deltaY *= -1;
    }
    obj.age += 1;
    if (obj.age < config.circleBs.maxAge) {
        requestAnimationFrame(function(){
            update(obj);
        });
        //setTimeout(function () {
        //    update(obj);
        //}, 10)
    }
}

function reset() {
    objects.forEach(function (obj) {
        obj.age = config.circleBs.maxAge;
    });
    objects = [];
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    ctx.beginPath();
    ctx.rect(0, 0, config.size.width, config.size.height);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    createNewCircle();
}

function createNewCircle() {
    var obj = {
        x: Math.random() * config.size.width,
        y: Math.random() * config.size.height,
        radius: Math.random() * 20,
        deltaX: 0,
        deltaY: 0,
        age: 0,
        col: '#' + (~~(Math.random() * 255)).toString(16) + (~~(Math.random() * 255)).toString(16) + (~~(Math.random() * 255)).toString(16)
    };
    objects.push(obj);
    requestAnimationFrame(function(){
        update(obj);
    });
}
$(document).ready(function () {
    canvas = $('#canvas')[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx = canvas.getContext("2d");
    reset();
    setInterval(createNewCircle, 5000)
});
