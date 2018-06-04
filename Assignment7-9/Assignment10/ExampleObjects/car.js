
// If grobjects has not been created do that
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Car = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Car
    Car = function Car(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.orientation = 0;
    }
    Car.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["car-vs", "car-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    // Back of truck
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5,    // x = 1

                     // Front of truck
                     -.5,-.5,0,  .5,-.5,0,  .5,  0, 0,        -.5,-.5,0,  .5,  0, 0, -.5,  0,0,    // z = 0
                     -.5,-.5,1,  .5,-.5,1,  .5,  0, 1,        -.5,-.5,1,  .5,  0, 1, -.5,  0,1,    // z = 1
                     -.5,-.5,0,  .5,-.5,0,  .5,-.5, 1,        -.5,-.5,0,  .5,-.5, 1, -.5,-.5,1,    // y = 0
                     -.5,  0,0,  .5,  0,0,  .5,  0, 1,        -.5,  0,0,  .5,  0, 1, -.5,  0,1,    // y = 1
                     -.5,-.5,0, -.5,  0,0, -.5,  0, 1,        -.5,-.5,0, -.5,  0, 1, -.5,-.5,1,    // x = 0
                      .5,-.5,0,  .5,  0,0,  .5,  0, 1,         .5,-.5,0,  .5,  0, 1,  .5,-.5,1,    // x = 1
					
					-.5,-.5,-1,  .5,-.5,-1,  .5,  0, -1,        -.5,-.5,-1,  .5,  0, -1, -.5,  0,-1,    // z = 0
                     -.5,-.5,0,  .5,-.5,0,  .5,  0, 0,        -.5,-.5,0,  .5,  0, 0, -.5,  0,0,    // z = 1
                     -.5,-.5,-1,  .5,-.5,-1,  .5,-.5, 0,        -.5,-.5,-1,  .5,-.5, 0, -.5,-.5,0,    // y = 0
                     -.5,  0,-1,  .5,  0,-1,  .5,  0, 0,        -.5,  0,-1,  .5,  0, 0, -.5,  0,0,    // y = 1
                     -.5,-.5,-1, -.5,  0,-1, -.5,  0, 0,        -.5,-.5,-1, -.5,  0, 0, -.5,-.5,0,    // x = 0
                      .5,-.5,-1,  .5,  0,-1,  .5,  0, 0,         .5,-.5,-1,  .5,  0, 0,  .5,-.5,0,    // x = 1
					
                ] },
                vnormal : { numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
					0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
        this.state = 0;
        this.lastTime = 0;
        this.wait = 1000;
    };
    Car.prototype.draw = function(drawingState) {
        advance(this, drawingState);
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        modelM = twgl.m4.multiply(modelM, twgl.m4.rotationY(this.orientation));
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM, spotlightPos:drawingState.spotlightPos });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Car.prototype.center = function(drawingState) {
        return this.position;
    }

    var speed = 3/1000;          // units per milli-second
    var turningSpeed = 2/1000;         // radians per milli-second

    function advance(car, drawingState) {

        // on the first call, the copter does nothing
        if (!car.lastTime) {
            car.lastTime = drawingState.realtime;
            return;
        }
        var delta = drawingState.realtime - car.lastTime;
        car.lastTime = drawingState.realtime;

        // now do the right thing depending on state
        switch (car.state) {
            case 0: // wait at the current position
                if (car.wait > 0) { car.wait -= delta; }
                else {  // take off!
                    car.state = 1;
                    car.wait = 1000;
                    car.orientation == 0 ? car.dir = Math.PI : car.dir = 0;
                }
                break;
            case 1: // spin towards next location
                var dtheta = car.dir - car.orientation;
                car.dz = -car.position[2];
                car.vz = car.dz/3.5;
                car.dst = Math.abs(car.dz*2);
                // if we're close, pretend we're there
                if (Math.abs(dtheta) < .01) {
                    car.state = 2;
                    car.destination = car.dz;
                    car.orientation = car.dir;
                }
                var rotAmt = turningSpeed * delta;
                if (dtheta > 0) {
                    car.orientation = Math.min(car.dir,car.orientation+rotAmt);
                } else {
                    car.orientation = Math.max(car.dir,car.orientation-rotAmt);
                }
                break;
            case 2: // go to 0
                if (car.dst > .01) {
                    var go = delta * speed;
                    // don't go farther than goal
                    go = Math.min(car.dst,go);
                    car.position[2] += car.vz * go;
                    car.dst -= go;
                } else { // we're effectively there, so go there
                    car.position[2] = car.dz;
                    car.state = 0;
                }
                break;
        }
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.

grobjects.push(new Car("car2",[-0.8,0.21,3.5], 0.5,[0.5,-0.5,-2]));
grobjects.push(new Car("car1",[0.8,0.21,-3.5], 0.5,[-0.5,-0.5,-2]));