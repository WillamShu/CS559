/**
 * Created by gleicher on 10/17/15.
 */
var grobjects = grobjects || [];

// make the two constructors global variables so they can be used later
var Drone = undefined;
var currSpotlightPos = [0, 0, 0];

(function () {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var droneBuffers = undefined;
    var texture = null;
    var normalMap = null;

    // constructor for Helicopter
    Drone = function Drone(name) {
        this.name = name
        this.position = [0,4,0];    // will be set in init
        this.target = [0, 0, 0];
        //this.color = [.9,.3,.4];
        this.color = [1, 1, 1];
        // about the Y axis - it's the facing direction
        this.orientation = 0;
        this.texture = null;
        this.c1 = new HermiteCurve([[0, 1, -20], [-16, 2.5, 0], [50, 0, 0], [0, 0, 25]]);
        this.c2 = new HermiteCurve([[-16, 2.5, 0], [0, 5, 16], [0, 0, 25], [50, 0, 0]]);
        this.c3 = new HermiteCurve([[0, 5, 16], [16, 7.5, 0], [50, 0, 0], [0, 0, 25]]);
        this.c4 = new HermiteCurve([[16, 7.5, 0], [0, 1, -20], [0, 0, 25], [50, 0, 0]]);
        this.texture = null;
        this.normalMap = null;
    }
    Drone.prototype.init = function(drawingState) {
        var gl=drawingState.gl;

        // No need to init the texture multiple times
    	if (texture == null) {
            this.texture = new Texture("https://c1.staticflickr.com/1/105/31495743835_a371cddd88_o.png", gl, 0);
            texture = this.texture;
        }
        else {
            this.texture = texture;
        }

        // No need to init the normal map multiple times
        if (normalMap == null) {
            this.normalMap = new Texture("https://c1.staticflickr.com/1/100/31533292395_504e0816ca_o.png", gl, 1);
            normalMap = this.normalMap;
        }
        else {
            this.normalMap = normalMap;
        }

        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cargo-vs", "cargo-fs"]);
        }
        if (!droneBuffers) {
            var arrays = Drone_data["object"];
            droneBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            shaderProgram.program.tex = gl.getUniformLocation(shaderProgram.program, "tex");
            shaderProgram.program.normalMap = gl.getUniformLocation(shaderProgram.program, "normalMap");
            gl.useProgram(shaderProgram.program);
            gl.uniform1i(shaderProgram.program.tex, 0);
            initTextureThenDraw(this.texture);
            gl.uniform1i(shaderProgram.program.normalMap, 1);
            initTextureThenDraw(this.normalMap);
        }
    };
    Drone.prototype.draw = function(drawingState) {
        // make the helicopter fly around
        // this will change position and orientation
        advance(this,drawingState);

        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.rotationY(this.orientation + Math.PI);
        modelM = twgl.m4.multiply(twgl.m4.scaling([1, 1, 1]), modelM);
        modelM = twgl.m4.multiply(twgl.m4.rotationX(0), modelM);
        //twgl.m4.setTranslation(modelM,this.position,modelM);
        modelM = twgl.m4.multiply(modelM, twgl.m4.lookAt(this.position, this.target, [0, 1, 0]));
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM, normalM: twgl.m4.transpose(twgl.m4.inverse(modelM))});
        twgl.setBuffersAndAttributes(gl,shaderProgram,droneBuffers);
        gl.activeTexture(gl.TEXTURE0);
        this.texture.bindTexture();
        gl.activeTexture(gl.TEXTURE1);
        this.normalMap.bindTexture();
        twgl.drawBufferInfo(gl, gl.TRIANGLES, droneBuffers);
    };
    Drone.prototype.center = function(drawingState) {
        return this.position;
    }

    function advance(plane, drawingState) {
        //plane.position = [6.0*(Math.sin(drawingState.realtime/1000)), 1.5*Math.sin(drawingState.realtime/1000) + 2.5, 6.0*(Math.cos(drawingState.realtime/1000))];
        //plane.orientation = drawingState.realtime/1000;
        currSpotlightPos = plane.position;
        if (plane.t < 1) {
            plane.position = plane.c1.value(plane.t);
            plane.target = plane.c1.dtValue(plane.t);
        }
        else if (plane.t >= 1 && plane.t < 2) {
            plane.position = plane.c2.value(plane.t - 1);
            plane.target = plane.c2.dtValue(plane.t - 1);
        }
        else if (plane.t >= 2 && plane.t < 3) {
            plane.position = plane.c3.value(plane.t - 2);
            plane.target = plane.c3.dtValue(plane.t - 2);
        }
        else if(plane.t >= 3 && plane.t < 4) {
            plane.position = plane.c4.value(plane.t - 3);
            plane.target = plane.c4.dtValue(plane.t - 3);
        }
        else {
            plane.t = 0;
            return;
        }
        plane.t += (drawingState.realtime - plane.lastTime)/3000;
        plane.lastTime = drawingState.realtime;
        return;
    }

})();

grobjects.push(new Drone("drone1"));

