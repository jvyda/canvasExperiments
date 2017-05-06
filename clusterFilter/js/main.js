var src_canvas;
var final_canvas;
var ctx;
var final_ctx;
var final_imageData;
var final_data;
var inputFields = {};

var input_data;

var config = {
    size: {
        width: 640,
        height: 923
    },
    clusterFilter: {
        dist: 120,
        fun: halfWayDistance,
        clusterFun: getEquidistantPoints,
        clusterAmount: 8,
        cubeSize: 255
    }
};

var imageInfo;
var clusterCenter;

function renderImageAndGetData(img, targetContext) {
    targetContext.drawImage(img, 0, 0);
    var imgData = targetContext.getImageData(0, 0, config.size.width, config.size.height);
    return imgData.data;
}

function resetImageInfo(data, copyClusterData) {
    for (var i = 0; i < data.length; i += 4) {
        var coor = getCoordinates(i);
        var x = coor.x;
        var y = coor.y;
        imageInfo[y][x] = {
            red: data[i],
            green: data[i + 1],
            blue: data[i + 2],
            alpha: data[i + 3],
            cluster: copyClusterData ? imageInfo[y][x].cluster : undefined
        };
    }
}

function createImageInfo() {
    var img = $("#src_image")[0];
    config.size.width = img.clientWidth;
    config.size.height = img.clientHeight;
    if (config.size.width == 0) {
        config.size.width = 500;
    }
    if (config.size.height == 0) {
        config.size.height = 500;
    }
    src_canvas.width = config.size.width;
    src_canvas.height = config.size.height;
    final_canvas.width = config.size.width;
    final_canvas.height = config.size.height;

    imageInfo = new Array(config.size.height);
    for (var i = 0; i < config.size.height; i++) {
        imageInfo[i] = new Array(config.size.width);
    }
    // draw the image here, because resizing causes the context to loose its imageData (it seems)
    input_data = renderImageAndGetData(img, ctx);
    resetImageInfo(input_data, false);
}
function recreateClusterAndClusterDistance() {
    var timeBefore = new Date();
    clusterCenter = config.clusterFilter.clusterFun();
    createImageInfo();
    for (var y = 0; y < config.size.height; y++) {
        for (var x = 0; x < config.size.width; x++) {
            var colorInfoAtThisPos = imageInfo[y][x];
            var minDist = Number.MAX_VALUE;
            var foundCluster = -1;
            for (var clusterIndex = 0; clusterIndex < config.clusterFilter.clusterAmount; clusterIndex++) {
                var clusterPoint = clusterCenter[clusterIndex];
                var dist = Math.sqrt(Math.pow(colorInfoAtThisPos.red - clusterPoint.x, 2) +
                    Math.pow(colorInfoAtThisPos.green - clusterPoint.y, 2) +
                    Math.pow(colorInfoAtThisPos.blue - clusterPoint.z, 2));
                if (dist < minDist) {
                    minDist = dist;
                    foundCluster = clusterIndex;
                }
            }
            colorInfoAtThisPos.cluster = {clusterIndex: foundCluster, dist: minDist};
        }
    }

    var timeAfter = new Date();
    formatInterval(timeBefore, timeAfter, "cluster distance and imageInfo creation took ...");
}

function halfWayDistance(colorInfoAtThisPos, unused) {
    colorInfoAtThisPos.red = (colorInfoAtThisPos.red + clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].x) / 2;
    colorInfoAtThisPos.green = (colorInfoAtThisPos.green + clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].y) / 2;
    colorInfoAtThisPos.blue = (colorInfoAtThisPos.blue + clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].z) / 2;
}

function exactlyCluster(colorInfoAtThisPos, unused) {
    colorInfoAtThisPos.red = clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].x;
    colorInfoAtThisPos.green = clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].y;
    colorInfoAtThisPos.blue = clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].z;
}

function addDistanceToPoint(colorInfoAtThisPos, dist) {
    var vect = {
        x: colorInfoAtThisPos.red - clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].x,
        y: colorInfoAtThisPos.green - clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].y,
        z: colorInfoAtThisPos.blue - clusterCenter[colorInfoAtThisPos.cluster.clusterIndex].z
    };
    vect.x /= dist;
    vect.y /= dist;
    vect.z /= dist;

    colorInfoAtThisPos.red += vect.x * config.clusterFilter.dist;
    colorInfoAtThisPos.green += vect.y * config.clusterFilter.dist;
    colorInfoAtThisPos.blue += vect.z * config.clusterFilter.dist;
}

function getEquidistantPoints() {
    var clusterCenter = [];
    var increment = config.clusterFilter.cubeSize / Math.cbrt(config.clusterFilter.clusterAmount);
    for (var x = 0; x < config.clusterFilter.cubeSize; x += increment) {
        for (var y = 0; y < config.clusterFilter.cubeSize; y += increment) {
            for (var z = 0; z < config.clusterFilter.cubeSize; z += increment) {
                clusterCenter.push({x: x, y: y, z: z});
            }
        }
    }
    return clusterCenter;
}
function getRandomClusters() {
    var clusterCenter = [];
    for (var i = 0; i < config.clusterFilter.clusterAmount; i++) {
        clusterCenter.push({
            x: Math.random() * config.clusterFilter.cubeSize,
            y: Math.random() * config.clusterFilter.cubeSize,
            z: Math.random() * config.clusterFilter.cubeSize
        });
    }
    return clusterCenter;
}
function applyClusterFilter() {
    var timeBefore = new Date();
    resetImageInfo(input_data, true);
    final_imageData = final_ctx.createImageData(config.size.width, config.size.height);
    final_data = final_imageData.data;
    for (var y = 0; y < config.size.height; y++) {
        for (var x = 0; x < config.size.width; x++) {
            var colorInfoAtThisPos = imageInfo[y][x];
            config.clusterFilter.fun(colorInfoAtThisPos, colorInfoAtThisPos.cluster.dist);
        }
    }

    for (var y = 0; y < config.size.height; y++) {
        for (var x = 0; x < config.size.width; x++) {
            var colorInfoAtThisPos = imageInfo[y][x];
            var index = getIndexForCoordinate(x, y);
            final_data[index] = colorInfoAtThisPos.red;
            final_data[index + 1] = colorInfoAtThisPos.green;
            final_data[index + 2] = colorInfoAtThisPos.blue;
            final_data[index + 3] = colorInfoAtThisPos.alpha;
        }
    }

    final_ctx.putImageData(final_imageData, 0, 0);
    var timeAfter = new Date();
    formatInterval(timeBefore, timeAfter, "rendering took...");
}

$(document).ready(function () {
    src_canvas = $("#src_canvas")[0];
    final_canvas = $("#final_canvas")[0];
    ctx = src_canvas.getContext("2d");
    final_ctx = final_canvas.getContext("2d");
    inputFields['clusterAmount'] = $('#cluster_in');
    inputFields['clusterAmount'].val(config.clusterFilter.clusterAmount);
    inputFields['distance'] = $('#dist_in');
    inputFields['distance'].val(config.clusterFilter.dist);
    inputFields['distanceWrapper'] = $('#dist_wrapper');
    inputFields['distanceWrapper'].hide();
    var newImg = new Image();
    newImg.src = "example.jpg";
    newImg.id = 'src_image';
    newImg.onload = function () {
        createImageInfo();
        recreateClusterAndClusterDistance();
        applyClusterFilter();
    };


});

function setNewFunction() {
    var selectedWAy = $("#fun_select").val();
    if (selectedWAy == 1) {
        config.clusterFilter.fun = halfWayDistance;
        inputFields['distanceWrapper'].hide();
    } else if (selectedWAy == 2) {
        config.clusterFilter.fun = exactlyCluster;
        inputFields['distanceWrapper'].hide();
    } else {
        config.clusterFilter.fun = addDistanceToPoint;
        inputFields['distanceWrapper'].show();
    }
    applyClusterFilter();
}

function setNewClusterFunction() {
    if ($("#equidistant_cluster").is(':checked')) {
        config.clusterFilter.clusterFun = getEquidistantPoints;
    } else {
        config.clusterFilter.clusterFun = getRandomClusters;
    }
    recreateClusterAndClusterDistance();
    applyClusterFilter();
}

function generateClusters() {
    recreateClusterAndClusterDistance();
    applyClusterFilter();
}

function updateConfig() {
    config.clusterFilter.dist = inputFields['distance'].val();
    var newClusterAmount = inputFields['clusterAmount'].val();
    if (config.clusterFilter.clusterAmount != newClusterAmount) {
        config.clusterFilter.clusterAmount = newClusterAmount;
        recreateClusterAndClusterDistance();
    }
    applyClusterFilter();
}

function previewFile() {
    var preview = $("#src_image")[0];
    var file = $("#img_upload")[0].files[0]; //sames as here
    var reader = new FileReader();
    reader.onloadend = function () {
        preview.src = reader.result;
        recreateClusterAndClusterDistance();
        applyClusterFilter();
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}
