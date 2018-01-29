var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

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

drawStar(75, 100, 5, 30, 15);