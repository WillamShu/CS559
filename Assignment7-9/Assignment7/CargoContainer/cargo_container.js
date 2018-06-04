// Cargo Container Object

// If grobjects has not been created do that
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Cargo = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;
    var texture = null;
    var normalMap = null;
	//var image = new Image();

    // constructor for Car
    Cargo = function Cargo(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.orientation = 0;
        this.texture = null;
        this.normalMap = null;
    }
    Cargo.prototype.init = function(drawingState) {

    	var gl=drawingState.gl;

    	// No need to init the texture multiple times
    	if (texture == null) {
            this.texture = new Texture("https://c8.staticflickr.com/6/5693/31289128015_f8db749ac4_b.jpg", gl, 0);
            texture = this.texture;
        }
        else {
            this.texture = texture;
        }

        // No need to init the normal map multiple times
        if (normalMap == null) {
            this.normalMap = new Texture("https://c1.staticflickr.com/1/690/30651358784_2cd11832ef_o.png", gl, 1);
            normalMap = this.normalMap;
        }
        else {
            this.normalMap = normalMap;
        }

        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cargo-vs", "cargo-fs"]);
        }
        if (!buffers) {
            var arrays = Cargo_container_01_data["object"];
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            shaderProgram.program.tex = gl.getUniformLocation(shaderProgram.program, "tex");
            shaderProgram.program.normalMap = gl.getUniformLocation(shaderProgram.program, "normalMap");
            gl.useProgram(shaderProgram.program);
    		gl.uniform1i(shaderProgram.program.tex, 0);
            initTextureThenDraw(this.texture);
            gl.uniform1i(shaderProgram.program.normalMap, 1);
            initTextureThenDraw(this.normalMap);
            //finishTextureInit(gl);
        }
    };
    Cargo.prototype.draw = function(drawingState) {
        advance(this, drawingState);
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        console.log();
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            model: modelM, normalM: twgl.m4.transpose(twgl.m4.inverse(modelM)), spotlightPos:drawingState.spotlightPos});
        gl.activeTexture(gl.TEXTURE0);
        this.texture.bindTexture();
        gl.activeTexture(gl.TEXTURE1);
        this.normalMap.bindTexture();
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cargo.prototype.center = function(drawingState) {
        return this.position;
    }

    var speed = 3/1000;          // units per milli-second
    var turningSpeed = 2/1000;         // radians per milli-second

    function advance(car, drawingState) {
    	return;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.

grobjects.push(new Cargo("cargo1",[-6,0.001,-6],.1));
grobjects.push(new Cargo("cargo12",[-6,0.001,6],.1));
grobjects.push(new Cargo("cargo22",[-6,1.001,6],.1));
grobjects.push(new Cargo("cargo32",[-6,2.001,6],.1));
grobjects.push(new Cargo("cargo42",[-6,3.001,6],.1));
grobjects.push(new Cargo("cargo52",[-6,4.001,6],.1));
grobjects.push(new Cargo("cargo62",[-6,5.001,6],.1));
grobjects.push(new Cargo("cargo72",[-6,6.001,6],.1));

