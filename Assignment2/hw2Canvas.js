// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// Event Listeners
addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Objects
function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.05;
    this.distanceFromCenter = randomIntFromRange(20, 50);
    this.lastMouse = {
        x: x, y: y
    };


    this.update = function () {
        const lastPoint = {x: this.x, y: this.y};
        this.radians += this.velocity;

        // Drag effect
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
        this.draw(lastPoint);
    };

    this.draw = function (lastPoint) {
        c.beginPath();
        c.strokeStyle = this.color;
        c.lineWidth = this.radius;
        c.moveTo(lastPoint.x, lastPoint.y);
        c.lineTo(this.x, this.y);
        c.stroke();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    };
}

var particles;

function init() {
    particles = [];

    for (var i = 0; i < 50; i++) {
        const radius = (Math.random());
        particles.push(new Particle(canvas.width / 4, canvas.height / 4, radius, randomColor(colors)));
    }
}

function planet(x, y, radius, color, velocity, distanceFromMotherPlanet) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.radians = Math.random() * Math.PI * 2;
    this.color = color;
    this.velocity = velocity;
    this.distanceFromCenter = distanceFromMotherPlanet;

    this.update = function () {
        this.radians += this.velocity;

        this.x = x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = y + Math.sin(this.radians) * this.distanceFromCenter;
        // c.clearRect(0, 0, canvas.width, canvas.height);

    };

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.beginPath();
        c.arc(planets[0].x, planets[0].y, distanceFromMotherPlanet, 0, Math.PI * 2, false);
        c.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        c.stroke();
        c.closePath();

    };
}

function satellite(x, y, radius, color, velocity, distanceFromMotherPlanet, pNum) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.radians = Math.random() * Math.PI * 2;
    this.color = color;
    this.velocity = velocity;
    this.distanceFromCenter = distanceFromMotherPlanet;

    this.update = function () {
        this.radians += this.velocity;
        this.x = planets[pNum].x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = planets[pNum].y + Math.sin(this.radians) * this.distanceFromCenter;

        // c.clearRect(0, 0, canvas.width, canvas.height);

    };

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.beginPath();
        c.arc(planets[pNum].x, planets[pNum].y, distanceFromMotherPlanet, 0, Math.PI * 2, false);
        c.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        c.stroke();
        c.closePath();
    };
}


var planets;
var satellites;

function initPlanet() {
    planets = [];
    planets[0] = new planet(canvas.width / 2, canvas.height / 2,(canvas.width / 2) * (1/30) , '#ff0404', 0, 0);
    planets[1] = new planet(canvas.width / 2, canvas.height / 2, 1.3, '#6f6f78', 0.01, (canvas.width / 2) * (1/20));
    planets[2] = new planet(canvas.width / 2, canvas.height / 2, 1.7, '#fffb09', 0.01, (canvas.width / 2) * (1/15));
    planets[3] = new planet(canvas.width / 2, canvas.height / 2, 2, '#52a1ff', 0.005, (canvas.width / 2) * (1/10));
    planets[4] = new planet(canvas.width / 2, canvas.height / 2, 1, '#ffb04c', 0.005, (canvas.width / 2) * (2/10));
    planets[5] = new planet(canvas.width / 2, canvas.height / 2, 20, '#ff7719', 0.005, (canvas.width / 2) * (4/10));
    planets[6] = new planet(canvas.width / 2, canvas.height / 2, 17, '#c8b29b', 0.003, (canvas.width / 2) * (6/10));
    planets[7] = new planet(canvas.width / 2, canvas.height / 2, 8, '#befffd', 0.002, (canvas.width / 2) * (8/10));
    planets[8] = new planet(canvas.width / 2, canvas.height / 2, 7.5, '#112aff', 0.002, (canvas.width / 2) * (9/10));
}
function initSat(){
    satellites = [];
    satellites[0] = new satellite(planets[5].x, planets[5].y, 1.5, '#ddcc53', 0.02, planets[5].radius * 4, 5);
    satellites[1] = new satellite(planets[6].x, planets[6].y, 1.5, '#ddb417', 0.02, planets[6].radius * 2, 6);
    satellites[2] = new satellite(planets[5].x, planets[5].y, 1.4, '#8f6729', 0.02, planets[5].radius * 3, 5);
    satellites[3] = new satellite(planets[5].x, planets[5].y, 1.3, '#ddda6c', 0.02, planets[5].radius * 2, 5);
    satellites[4] = new satellite(planets[3].x, planets[3].y, 1, '#ddd3dc', 0.02, planets[3].radius * 3, 3);
    satellites[5] = new satellite(planets[5].x, planets[5].y, 1.2, '#34dd4e', 0.02, planets[5].radius * 1.5, 5);
    satellites[6] = new satellite(planets[8].x, planets[8].y, 2, '#34dd4e', 0.02, planets[5].radius * 2, 8);
}


// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (particle) {
        particle.update();
    });
    planets.forEach(function (planet) {
        planet.update();
    });
    satellites.forEach(function (satellite) {
        satellite.update();
    });
    planets.forEach(function (planet) {
        planet.draw();
    });
    satellites.forEach(function (satellite) {
        satellite.draw();
    });

    c.font = "20px Verdana";
    c.fillText("Explore the solar system: Assume you are an extraterrestrial mist. (Move your mouse)", 50, 50);
    c.fillStyle = "#fbfaff";
}

init();
initPlanet();
initSat();
animate();