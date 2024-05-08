// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;

  void main() {
    gl_Position = u_GlobalRotateMatrix*u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;  // uniform
  void main() {
  gl_FragColor = u_FragColor;
  }`

// global var
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl",{preserveDrawingBuffer: true})
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);

}


function connectVariablesToGLSL(){

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements)


}

//constant
//const POINT =0
//const TRIANGLE =1
//const CIRCLE =2
//global ui
let g_selectedColor =[1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_globalAngle = 0;
let RotateBody = 0;
let RotateNeck = 0;
let RotateHead = 0;
let Mouthopen = 0;
let RotateTail =0;
let back_leg_1 =0;
let back_leg_2 =0; 
let front_leg_1 =0;
let front_leg_2 =0;
let animation = false;
//let g_selectedType = POINT

  function addActionsforHtmlUI(){
    //button
    document.getElementById("Animation_ON").onclick = function(){ animation=true;renderALLshapes();}
    document.getElementById("Animation_OFF").onclick = function(){ animation=false;renderALLshapes();}
    //document.getElementById("pointButton").onclick = function(){ g_selectedType = POINT}
    //document.getElementById("triangleButton").onclick = function(){ g_selectedType = TRIANGLE}
    //document.getElementById("circleButton").onclick = function(){ g_selectedType = CIRCLE}
    //slider
    document.getElementById("Mouthopen").addEventListener("mousemove", function(){  Mouthopen= this.value;renderALLshapes();}) 
    document.getElementById("RotateHead").addEventListener("mousemove", function(){  RotateHead= this.value;renderALLshapes(); }) 
    document.getElementById("RotateNeck").addEventListener("mousemove", function(){ RotateNeck= this.value;renderALLshapes(); })
    document.getElementById("RotateBody").addEventListener("mousemove", function(){ RotateBody= this.value;renderALLshapes();})
    document.getElementById("RotateTail").addEventListener("mousemove", function(){ RotateTail= this.value;renderALLshapes();})
    document.getElementById("angleslider_x").addEventListener("mousemove", function(){ g_globalAngle_x= Number(this.value); renderALLshapes();})
    //legs
    document.getElementById("back_leg_1").addEventListener("mousemove", function(){  back_leg_1= this.value;renderALLshapes();}) 
    document.getElementById("back_leg_2").addEventListener("mousemove", function(){  back_leg_2= this.value;renderALLshapes(); }) 
    document.getElementById("front_leg_1").addEventListener("mousemove", function(){ front_leg_1= this.value;renderALLshapes(); })
    document.getElementById("front_leg_2").addEventListener("mousemove", function(){ front_leg_2= this.value;renderALLshapes();})
  };

function main() {
  
  //canvas
  setupWebGL();
  //GLSL shader
  connectVariablesToGLSL();
  //button
  addActionsforHtmlUI()

  
  
  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  canvas.onmousedown = function(ev){ if(ev.buttons == 1){ clickdown(ev)}};
  canvas.onmousemove = function(ev){ if(ev.buttons == 1){ click(ev)}};
  canvas.onmouseup = function(ev){ if(ev.buttons == 1){ clickup(ev)}};


  // Specify the color for clearing <canvas>
  gl.clearColor(0.5, 0.8, 1.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT);

  requestAnimationFrame(tick)
}


var startTime = performance.now()/1000;
var seconds = performance.now()/1000 - startTime;
function tick(){

  seconds = performance.now()/1000 - startTime;
    //console.log(performance.now())

  AnimationAngle();

  shiftAnimation();

  renderALLshapes();



  requestAnimationFrame(tick)

}


let g_globalAngle_x =0;
let g_globalAngle_y =0;
let last_x =0;
let last_y =0;
let shiftanimation= false;
let oppening =false

//let drag = false;

function clickdown(ev){

  if(ev.shiftKey){
    shiftanimation = true;
    oppening = true;
  }


  let [x,y] = convertCoordinatesEventToGL(ev);
  last_x=x
  last_y=y
}

function clickup(ev){
  let [x,y] = convertCoordinatesEventToGL(ev);
  last_x=x
  last_y=y
}

function click(ev) {

let [x,y] = convertCoordinatesEventToGL(ev);
var dx=  10*(x-last_x)
var dy=  10*(y-last_y)
g_globalAngle_x = g_globalAngle_x + dx
g_globalAngle_y = g_globalAngle_y + dy

renderALLshapes();

//console.log("x" + x + "y"+ y)
//console.log("dyx" + dx + "dy"+ dy)
//console.log("global_x: " + g_globalAngle_x + " global_y:"+ g_globalAngle_y)
//console.log(typeof g_globalAngle_x);

}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}


function AnimationAngle(){
  if(animation){
    back_leg_1 = 45*Math.sin(1.5*seconds);
    back_leg_2 = -45*Math.sin(1.5*seconds); 
    front_leg_1 = 45*Math.sin(1.5*seconds);
    front_leg_2 = -45*Math.sin(1.5*seconds);

    RotateHead = 10*Math.sin(1.5*seconds);
    RotateTail = 10*Math.sin(1.5*seconds);

  }
}



function shiftAnimation(){

    if(shiftanimation == true){

      if(Mouthopen >= 80){
        oppening = false
      }

      if(oppening == true){
        Mouthopen+=2
      }
      else{
        Mouthopen-=10
      }

      if(Mouthopen <= 0){
        shiftanimation = false;
        oppening = false
      }
    }
   
}


function renderALLshapes(){

  var startTime_render = performance.now();

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);


  var globalRotMat= new Matrix4().rotate(g_globalAngle_x,0,1,0);
  globalRotMat= globalRotMat.rotate(g_globalAngle_y,1,0,0);
  //globalRotMat= globalRotMat.rotate(0,g_globalAngle_y,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT)


  //body main
  var body_top = new Cube();
  body_top.color = [0.3,0.8,0.2,1.0]
  body_top.mouth = [0.3,0.8,0.2,1.0]
  body_top.matrix.rotate(RotateBody,1.0,0.0,0.0)
  body_top.matrix.rotate(180,0,1,0)
  var body_top_mat = new Matrix4(body_top.matrix);
  body_top.matrix.translate(-0.2,-0.2,0.0)
  body_top.matrix.scale(0.25,0.05,0.25)
  body_top.render()

  
  
  var body_bottom = new Cube();
  body_bottom.color = [0.9,1,0.5,1.0]
  body_bottom.mouth = [0.9,1,0.5,1.0]
  body_bottom.matrix =   new Matrix4(body_top_mat);
  //body_bottom.matrix.rotate(180,0,1,0)
  body_bottom.matrix.translate(-0.2,-.25,0.0)
  body_bottom.matrix.scale(0.25,0.05,0.25)
  //body_bottom.matrix.translate(0.0,-1.0,0.0)

  body_bottom.render()
  

  //legs

  //back 1
  var leg_back_1 = new Cube();
  leg_back_1.color = [0.3,0.8,0.2,1.0]
  leg_back_1.mouth = [0.3,0.8,0.2,1.0]
  leg_back_1.matrix = new Matrix4(body_top_mat);

  leg_back_1.matrix.translate(0.1,-0.2,0.05)
  leg_back_1.matrix.rotate(back_leg_1,1,0,0)
  leg_back_1.matrix.translate(-0.1,0.2,-0.05)

  
  leg_back_1.matrix.rotate(90,0,0,1)
  leg_back_1.matrix.rotate(90,0,1,0)
  

  leg_back_1.matrix.translate(-0.1,0.2,-.3)
  leg_back_1.matrix.scale(0.075,0.05,0.125)
  leg_back_1.render_tri(.4,.5,false)
  // back 2
  var leg_back_2 = new Cube();
  leg_back_2.color = [0.3,0.8,0.2,1.0]
  leg_back_2.mouth = [0.3,0.8,0.2,1.0]
  leg_back_2.matrix = new Matrix4(body_top_mat);

  leg_back_2.matrix.translate(0.1,-0.2,0.05)
  leg_back_2.matrix.rotate(back_leg_2,1,0,0)
  leg_back_2.matrix.translate(-0.1,0.2,-0.05)

  leg_back_2.matrix.rotate(90,0,0,-1)
  leg_back_2.matrix.rotate(270,0,1,0)
  leg_back_2.matrix.translate(0.025,0.05,-.3)
  leg_back_2.matrix.scale(0.075,0.05,0.125)
  leg_back_2.render_tri(.4,.5,false)

  //tail
  var tail_top = new Cube();
  tail_top.color = [0.3,0.8,0.2,1.0]
  tail_top.mouth = [0.3,0.8,0.2,1.0]
  tail_top.matrix = new Matrix4(body_top_mat);

  tail_top.matrix.translate(-0.2,-0.2,0.0)
  tail_top.matrix.rotate(RotateTail,1,0,0)
  tail_top.matrix.translate(0.2,0.2,0.0)
  
  var tail_top_mat = new Matrix4(tail_top.matrix);
  tail_top.matrix.translate(-0.2,-0.2,-0.35)
  tail_top.matrix.scale(0.25,0.05,0.35)
  tail_top.render_tri(.4,.5,false)
  //tail bottom
  var tail_bottom = new Cube();
  tail_bottom.color = [0.9,1,0.5,1.0]
  tail_bottom.mouth = [0.9,1,0.5,1.0]
  tail_bottom.matrix = new Matrix4(tail_top_mat);

  tail_bottom.matrix.rotate(180,0.0,0.0,1.0)
  tail_bottom.matrix.translate(-0.05, 0.2,-0.35)
  tail_bottom.matrix.scale(0.25,0.05,0.35)
  tail_bottom.render_tri(.4,.5,false)

  //neck
  var body_top_2 = new Cube();
  body_top_2.color = [0.3,0.8,0.2,1.0]
  body_top_2.mouth = [0.3,0.8,0.2,1.0]
  body_top_2.matrix = body_top_mat;

  body_top_2.matrix.translate(-0.2,-0.2,0.25)
  body_top_2.matrix.rotate(RotateNeck,1,0,0)
  body_top_2.matrix.translate(0.2,0.2,-0.25)
  var body_top_2_mat = new Matrix4(body_top_2.matrix);

  body_top_2.matrix.translate(-0.2,-0.2,0.25)
  body_top_2.matrix.scale(0.25,0.05,0.25)
  body_top_2.render_tri(.1,.1,true)
  
  //neck bottom
  var body_bottom_2 =new Cube();
  body_bottom_2.color = [0.9,1,0.5,1.0]
  body_bottom_2.matrix = new Matrix4(body_top_2.matrix);
  body_bottom_2.matrix.rotate(180,0.0,0.0,1.0)
  body_bottom_2.matrix.translate(-1.0,0.0,0.0)
  //body_bottom_2.render()
  body_bottom_2.render_tri(.1,.1)
  

   //legs front

  //front 1
  var leg_front_1 = new Cube();
  leg_front_1.color = [0.3,0.8,0.2,1.0]
  leg_front_1.mouth = [0.3,0.8,0.2,1.0]
  leg_front_1.matrix = new Matrix4(body_top_2_mat);

  leg_front_1.matrix.translate(-0.1,-0.2,0.425)
  leg_front_1.matrix.rotate(front_leg_1,1,0,0)
  leg_front_1.matrix.translate(0.1,0.2,-0.425)

  leg_front_1.matrix.rotate(90,0,0,1)
  leg_front_1.matrix.rotate(90,0,1,0)
  leg_front_1.matrix.translate(-0.48,0.18,-.3)
  leg_front_1.matrix.scale(0.075,0.05,0.125)
  leg_front_1.render_tri(.4,.5,false)
  // front 2
  var leg_front_2 = new Cube();
  leg_front_2.color = [0.3,0.8,0.2,1.0]
  leg_front_2.mouth = [0.3,0.8,0.2,1.0]
  leg_front_2.matrix = new Matrix4(body_top_2_mat);

  leg_front_2.matrix.translate(-0.1,-0.2,0.425)
  leg_front_2.matrix.rotate(front_leg_2,1,0,0)
  leg_front_2.matrix.translate(0.1,0.2,-0.425)

  leg_front_2.matrix.rotate(90,0,0,-1)
  leg_front_2.matrix.rotate(270,0,1,0)
  leg_front_2.matrix.translate(0.4,0.03,-.3)
  leg_front_2.matrix.scale(0.075,0.05,0.125)
  leg_front_2.render_tri(.4,.5,false)



  //Head
  var head_top =new Cube();
  head_top.color = [0.3,0.8,0.2,1.0]
  head_top.mouth = [.8,0.4,0.4,1.0]
  head_top.matrix = body_top_2_mat;
  head_top.matrix.translate(-0.175,-0.2,0.5)
  head_top.matrix.rotate(RotateHead,1,0,0)
  head_top.matrix.translate(0.175,0.2,-0.5)
  var head_top_mat = new Matrix4(head_top.matrix);
  head_top.matrix.translate(-0.175,-0.2,0.5)
  head_top.matrix.rotate(Mouthopen,-1,0,0)
  head_top.matrix.translate(0.175,0.2,-0.5)
  var head_top_open_mat = new Matrix4(head_top.matrix);
  //
  head_top.matrix.translate(-0.175,-0.2,0.5)
  head_top.matrix.scale(0.2,0.045,0.25)
  head_top.render_tri(.25,.25,true)

  //eye 1
  var eye_1 = new Cube();
  eye_1.color =  [0.3,0.8,0.2,1.0]
  eye_1.mouth = [0,0,0,1]
  eye_1.matrix = new Matrix4(head_top_open_mat);
  eye_1.matrix.rotate(90,-1,0,0)
  eye_1.matrix.rotate(90,0,0,1)
  //head_bottom.matrix.rotate(180,0.0,0.0,1.0)
  eye_1.matrix.translate(-0.6,-0.02,-0.16)
  //eye_1.matrix.scale(0.2,0.045,0.25)
  eye_1.matrix.scale(0.075,0.05,0.025)
  eye_1.render_tri(.25,.25,true)

  //eye 2
  var eye_2 = new Cube();
  eye_2.color =  [0.3,0.8,0.2,1.0]
  //eye_2.mouth = [.9,.9,.7,1]
  eye_2.mouth = [0,0,0,1]
  eye_2.matrix = new Matrix4(head_top_open_mat);
  eye_2.matrix.rotate(180,0,1,0)
  eye_2.matrix.rotate(90,-1,0,0)
  eye_2.matrix.rotate(90,0,0,1)
  eye_2.matrix.translate(0.525,-0.17,-0.16)
  eye_2.matrix.scale(0.075,0.05,0.025)
  eye_2.render_tri(.25,.25,true)
  

  //head bottom
  var head_bottom = new Cube();
  head_bottom.color = [0.9,1,0.5,1.0]
  head_bottom.mouth = [1,0.4,0.4,1.0]
  head_bottom.matrix = new Matrix4(head_top_mat);

  head_bottom.matrix.rotate(180,0.0,0.0,1.0)
  head_bottom.matrix.translate(-0.025,0.2,0.5)
  head_bottom.matrix.scale(0.2,0.045,0.25)
  head_bottom.render_tri(.25,.25,true)

  var duration = performance.now() - startTime_render;
  sendTextToHTML("ms: " + Math.floor(duration) + "fps: " + Math.floor(10000/duration),"numdot")


}

function sendTextToHTML(text,htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Fialed to get " + htmlID + "from HTML")
    return;
  }
  htmlElm.innerHTML = text;

}


