var canvas = document.getElementById('myCanvas');

canvas.width = innerWidth;
canvas.height = innerHeight;
var slider = document.getElementById('slider');
var c = canvas.getContext('2d');

slider.value = 20;

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    c.beginPath();
    c.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y)
        rot += step
    }
    c.lineTo(cx, cy - outerRadius)
    c.closePath();
    c.lineWidth=5;
    c.strokeStyle='#0d34ff';
    c.stroke();
    c.fillStyle='#fbfaff';
    c.fill();

}

function Fire(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = "#EE0";
        c.fill();
        c.beginPath();
        c.arc(this.x, this.y, this.radius - 10, 0, Math.PI * 2, false);
        c.fillStyle = "#882210";
        c.fill();
        c.beginPath();
        c.rect(this.x - 23, this.y - 15, 15, 10);
        c.fillStyle = "#000";
        c.fill();
        c.beginPath();
        c.rect(this.x + 15, this.y - 15, 15, 10);
        c.fillStyle = "#000";
        c.fill();
        c.beginPath();
        c.moveTo(this.x - 23, this.y - 15);
        c.lineTo(this.x + 15, this.y - 15);
        c.closePath();
        c.strokeStyle = "#000";
        c.stroke();

        c.beginPath();
        c.moveTo(this.x - 6, this.y + 20);
        c.lineTo(this.x + 10, this.y + 20);
        c.closePath();
        c.strokeStyle = "#000";
        c.stroke();

    };

    this.update = function () {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        this.draw();

    }
}

function defBar(x) {
    this.x = x;
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, innerHeight*2/3, 30, 0, Math.PI * 2, false);
        c.fillStyle = "#ff3a19";
        c.fill();
        c.beginPath();
        c.arc(this.x, innerHeight*2/3, 25, 0, Math.PI * 2, false);
        c.fillStyle = "#fbfaff";
        c.fill();
        c.beginPath();
        c.arc(this.x, innerHeight*2/3, 20, 0, Math.PI * 2, false);
        c.fillStyle = "#ff441b";
        c.fill();
        c.beginPath();
        c.arc(this.x, innerHeight*2/3, 15, 0, Math.PI * 2, false);
        c.fillStyle = "#0d34ff";
        c.fill();
        drawStar(this.x, innerHeight*2/3, 5, 10.5, 5);
    };

}

var fireBall = new Fire(40, 40, 5, 3, 40);
var myReq;


function animate() {
    var sliderPos = slider.value * innerWidth / 100;
    myReq = requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    var defenceBar = new defBar(sliderPos);
    fireBall.update();
    defenceBar.draw();
    if((fireBall.x <= sliderPos + 25 ) &&
        (fireBall.x >= sliderPos - 25) &&
        (fireBall.y >= innerHeight*2/3 - 25) &&
        (fireBall.y <= innerHeight*2/3 + 25)){
        cancelAnimationFrame(myReq);

        var img = document.createElement("img");

        img.src = "https://i.ytimg.com/vi/mgRsDIdbpXE/maxresdefault.jpg";

        var src = document.getElementById("x");
        src.appendChild(img);

        var td1 = document.getElementById('td1');
        var text = document.createTextNode("YOU SAVED OUR COUNTRY!");
        td1.appendChild(text);
    }


}

animate();
