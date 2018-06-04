var canvas;
var context;
var m4 = twgl.m4;

function moveToTx(x, y, z, Tx) {
    var loc = [x, y, z];
    var locTx = m4.transformPoint(Tx, loc);
    context.moveTo(locTx[0] + 300, -locTx[1] + 300);
}

function lineToTx(x, y, z, Tx) {
    var loc = [x, y, z];
    var locTx = m4.transformPoint(Tx, loc);
    context.lineTo(locTx[0] + 300, -locTx[1] + 300);
}

function planet(x, y, z, radius, color) {
    var rotation = 0;
    var discTx;
    this.draw = function (Tx) {

        var i;
        context.beginPath();
        context.lineWidth = 10;
        context.strokeStyle = color;
        context.fillStyle = color;
        context.closePath();

        Tx = m4.multiply(discTx, Tx);
        moveToTx(0, radius, 0, Tx);
        for (i = 0; i < 2 * Math.PI; i += Math.PI / 1000) {
            lineToTx(radius * Math.sin(i), radius * Math.cos(i), 0, Tx);
        }
        context.stroke();
        context.fill();
        context.strokeStyle = "black";
        context.fillStyle = "black";
        moveToTx(0, 0, 0, Tx);
    };

    this.update = function () {
        rotation += 0.01;
        discTx = m4.translate(m4.rotationZ(rotation), [x, y, z]);
        discTx = m4.multiply(m4.rotationY(rotation), discTx);
    };

    this.position = function () {
        return m4.transformPoint(discTx, [0, 0, 0]);
    }
}


function Axes(x, y, z, size) {


    this.draw = function (twglTx) {
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = "black";
        moveToTx(x, y, z, twglTx);
        lineToTx(x + size, y, z, twglTx);
        context.stroke();
        context.beginPath();
        moveToTx(x, y, z, twglTx);
        lineToTx(x, y + size, z, twglTx);
        context.stroke();
        context.beginPath();
        moveToTx(x, y, z, twglTx);
        lineToTx(x, y, z + size, twglTx);
        context.stroke();
        context.closePath();
    };

    this.update = function () {
        console.log("update successfully.")
    };

    this.position = function () {
        return [x, y, z];
    }

}


function setup() {
    "use strict";
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    // canvas.width = innerWidth;
    // canvas.height = innerHeight;

    var nextUpValue = document.getElementById("up");

    var slider1 = document.getElementById('slider1');
    slider1.value = 300;
    var slider2 = document.getElementById('slider2');
    slider2.value = 200;
    var slider3 = document.getElementById('slider3');
    slider3.value = 400;

    var elements = [];
    var eye = [0, 0, 0];
    var up = [0, 0, 1];
    var upS = [[0, 0, 1], [0, 1, 0], [1, 0, 0]];
    var currTarget = 0;
    var target = [0, 0, 0];
    var thisPos = 0;
    var Tcamera = m4.inverse(m4.lookAt(eye, target, up));
    var angle = 0;

    this.changeUp = function () {
        up = upS[thisPos];
        if (thisPos + 1 > 2)
            thisPos = 0;
        else
            thisPos++;

    };

    this.addElement = function (element) {
        elements.push(element);
    };

    this.setEye = function (x, y, z) {
        eye = [x, y, z];
        Tcamera = m4.inverse(m4.lookAt(eye, target, up));
    };

    this.setEye(slider1.value, slider2.value, slider3.value);
    this.addElement(new Axes(100, 100, 100, 250));
    this.addElement(new planet(100, 100, 100, 50, '#6f6f78'));
    this.addElement(new planet(50, 50, 200, 10, '#fffb09'));
    this.addElement(new planet(100, 100, 300, 30, '#52a1ff'));


    function loop() {

        context.clearRect(0, 0, canvas.width, canvas.height);

        target = elements[currTarget % elements.length].position();

        eye = [slider1.value, slider2.value, slider3.value];
        Tcamera = m4.inverse(m4.lookAt(eye, target, up));
        angle += .01;
        for (var i = 0; i < elements.length; i++) {
            elements[i].update();
        }

        elements.forEach(function (element) {
            element.draw(Tcamera)
        });

        window.requestAnimationFrame(loop);
    }

    nextUpValue.addEventListener("click", this.changeUp);
    loop();
}

window.onload = setup;
