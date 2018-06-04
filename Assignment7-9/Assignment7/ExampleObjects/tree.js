/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the fish is more complicated since it is designed to allow making many fishs

 we make a constructor function that will make instances of fishs - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all fishs - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each fish instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var tree = undefined;


// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all trees - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for trees
    tree = function tree(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    tree.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all trees
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["tree-vs", "tree-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    //Stump Front&Back
                    -.1,0,0,	.1,0,0,		-.1,.6,0,
                    -.1,.6,0,	.1,.6,0,	.1,0,0,

                    -.1,0,.1,	.1,0,.1,	-.1,.6,.1,
                    -.1,.6,.1,	.1,.6,.1,	.1,0,.1,

                    //Stump R&L
                    .1,.6,0,	.1,.6,.1,	.1,0,0,
                    .1,0,0,		.1,0,.1,	.1,.6,.1,

                    -.1,.6,0,	-.1,.6,.1,	-.1,0,0,
                    -.1,0,0,	-.1,0,.1,	-.1,.6,.1,

                    //tree
                    -.8,.6,.05,	.8,.6,.05,	0,2.0,.05,

                    0,.6,.85,	0,.6,-.85,	0,2.0,.05,

                ] },
                vnormal : {numComponents:3, data: [
                	//Stump
                    0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,-1, 0,0,-1, 0,0,-1,

                    0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,-1, 0,0,-1, 0,0,-1,

                    //L&R
                    1,0,0, 1,0,0, 1,0,0,
                    1,0,0, 1,0,0, 1,0,0,

                    1,0,0, 1,0,0, 1,0,0,
                    1,0,0, 1,0,0, 1,0,0,

                    //tree
                    0,0,-1, 0,0,-1, 0,0,-1,

                    0,0,-1, 0,0,-1, 0,0,-1,

                ]},

                vcolor : {numComponents:3, data: [
                	//Stump
                    0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373,
					0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373,
					0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373,
					0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373,
                    //L&R
                    0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373,
					0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373,
					0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373,
					0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373, 0.721569, 0.52549, 0.0431373,

                    //tree
                    0,0.392157,0,  0.333333, 0.419608, 0.184314, 0.560784, 0.737255, 0.560784,

                    0,0.392157,0,  0.333333, 0.419608, 0.184314, 0.560784, 0.737255, 0.560784,

                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    tree.prototype.draw = function(drawingState) {
        // we make a model matrix to place the tree in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            fishcolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    tree.prototype.center = function(drawingState) {
        return this.position;
    }



})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of trees, just don't load this file.


//Random trees
grobjects.push(new tree("tree5",[-1.5,0,0],1));
grobjects.push(new tree("tree6",[ 1.5,0,0],1));
grobjects.push(new tree("tree5",[-1.5,0,-2],1));
grobjects.push(new tree("tree6",[ 1.5,0,-2],1));
grobjects.push(new tree("tree5",[-1.5,0,2],1));
grobjects.push(new tree("tree6",[ 1.5,0,2],1));
grobjects.push(new tree("tree5",[-1.5,0,4],1));
grobjects.push(new tree("tree6",[ 1.5,0,4],1));
grobjects.push(new tree("tree5",[-1.5,0,-4],1));
grobjects.push(new tree("tree6",[ 1.5,0,-4],1));


