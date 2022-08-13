// https://www.khanacademy.org/computing/computer-programming/programming-games-visualizations/programming-3d-shapes/a/rotating-3d-shapes
// https://js6450.github.io/basic-p5.html
// file:///C:/Hammad/Programs/3D%20Cube/index.html

class Vector3D {

  constructor (x, y, z) {

    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);

  };

  projection3D () {

    return (new Vector2D(this.x, this.y))

  };
  
};

class Vector2D {

  constructor (x, y) {

    this.x = parseFloat(x);
    this.y = parseFloat(y);

  };

};

class Axis {

  constructor (x=10, y=10, z=10) {

    this.xAxis = x;
    this.yAxis = y;
    this.zAxis = z;

    // for x axis red color
    ctx.strokeColor = "#FF0000";
    ctx.moveTo(0, 0);
    ctx.moveTo(this.xAxis, 0);

    // for y axis blue color
    ctx.strokeColor = "#00FF00";
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.yAxis);

    // for z axis green color
    ctx.strokeColor = "#0000FF";
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 0)
    // this will be for now invisible
    // but when the camera will be moved
    // it will be drawn on the screen

  };

};

class Perspective {

  constructor () {};

  drawHorizonLine () {

    ctx.beginPath();
    ctx.moveTo(canvas.width * -(1 / 2), 0);
    ctx.lineTo(canvas.width * (1 / 2), 0);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "000000";
    ctx.closePath();
    ctx.stroke();

  };

};

class OnePointPerspective extends Perspective {

  constructor () {

    super();
    this.vanishingPoint = new Vector3D(0, 0, 0);
    this.pointSize = 2.5

  };

  drawVanishingPoint () {

    ctx.beginPath();
    ctx.arc(this.vanishingPoint.x, this.vanishingPoint.y, this.pointSize, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.strokeStyle = "000000";
    ctx.stroke();
    ctx.fillStyle = "000000";
    ctx.fill();

  };

  drawPerspective () {

    this.drawHorizonLine();
    this.drawVanishingPoint();

  };

  drawReferenceLines (object) {

    for (let vertex of object.faces[2]) {

      ctx.beginPath();
      ctx.moveTo(this.vanishingPoint.x, this.vanishingPoint.y);
      ctx.lineTo(object.vertices[vertex].x, object.vertices[vertex].y)
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "000000";
      ctx.stroke();

    };

    

  };

};

class Cube {

  constructor (x, y, z, dim={
    width: 200, 
    depth: null, 
    height: null
  }, colors={
    topFace: null, 
    bottomFace: null, 
    rightFace: null, 
    leftFace: null, 
    frontFace: null, 
    backFace: null
  }) {

    this.vertexColor = "#28A86B";
    this.edgeColor = "#000000";
    this.vertexSize = 5;

    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;

    if (!dim.depth && !dim.height) dim.depth = dim.height = dim.width;
    this.dim = dim;

    this.settingCenter(x, y, z);


    // FRONT FACE
    // top-right to bottom-right
    let edge0 = [0, 1];
    // bottom-right to bottom-left
    let edge1 = [1, 3];
    // bottom-left to top-left
    let edge2 = [3, 2];
    // top-left to top-right
    let edge3 = [2, 0];

    // ROTATED ON X AXIS TO TOP FACE

    // TOP FACE
    // bottom-right to top-right
    let edge4 = [0, 4];
    // top-right to top-left
    let edge5 = [4, 6];
    // top-left to bottom-left
    let edge6 = [6, 2];
    // bottom-left to bottom-right already drawn

    // ROTATED ON Y AXIS TO BACK FACE

    // BACK FACE
    // top-right to top-left already drawn
    // top-right to bottom-right
    let edge7 = [6, 7];

    // bottom-right to bottom-left
    let edge8 = [7, 5];

    // bottom-left to top-left
    let edge9 = [5, 4];

    // ROTATED ON X AXIS TO BOTTOM FACE

    // BOTTOM FACE
    // top-right to bottom-right
    let edge10 = [1, 5];
    // bottom-right to bottom-left already drawn
    // bottom-left to top-left
    let edge11 = [7, 3];
    // top-left to top-right already drawn

    this.edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11];

    // order of vertices do matter
    this.topFace = [0, 2, 6, 4];
    this.bottomFace = [1, 3, 7, 5];
    this.frontFace = [0, 1, 3, 2];
    this.backFace = [4, 5, 7, 6];
    this.rightFace = [0, 1, 5, 4];
    this.leftFace = [2, 3, 7, 6];

  };

  settingCenter (x, y, z) {

    this.center = new Vector3D(x, y, z);

    // front-face top-right vertex
    let vertex0 = new Vector3D(this.center.x + (this.dim.width / 2), this.center.y - (this.dim.height / 2), this.center.z + (this.dim.depth / 2));
    // front-face bottom-right vertex
    let vertex1 = new Vector3D(this.center.x + (this.dim.width / 2), this.center.y + (this.dim.height / 2), this.center.z + (this.dim.depth / 2));
    // front-face top-left vertex
    let vertex2 = new Vector3D(this.center.x - (this.dim.width / 2), this.center.y - (this.dim.height / 2), this.center.z + (this.dim.depth / 2));
    // front-face bottom-left vertex
    let vertex3 = new Vector3D(this.center.x - (this.dim.width / 2), this.center.y + (this.dim.height / 2), this.center.z + (this.dim.depth / 2));
    // rear-face top-right vertex
    let vertex4 = new Vector3D(this.center.x + (this.dim.width / 2), this.center.y - (this.dim.height / 2), this.center.z - (this.dim.depth / 2));
    // rear-face bottom-right vertex
    let vertex5 = new Vector3D(this.center.x + (this.dim.width / 2), this.center.y + (this.dim.height / 2), this.center.z - (this.dim.depth / 2));
    // rear-face top-left vertex
    let vertex6 = new Vector3D(this.center.x - (this.dim.width / 2), this.center.y - (this.dim.height / 2), this.center.z - (this.dim.depth / 2));
    // rear-face bottom-left vertex
    let vertex7 = new Vector3D(this.center.x - (this.dim.width / 2), this.center.y + (this.dim.height / 2), this.center.z - (this.dim.depth / 2));

    this.vertices = [vertex0, vertex1, vertex2, vertex3, vertex4, vertex5, vertex6, vertex7];

  };

  sortFaces () {

    this.colors = {"red": this.topFace, "blue": this.bottomFace, "green": this.frontFace, "#FFAAAA": this.backFace, "black": this.rightFace, "yellow": this.leftFace};

    this.faces =  [this.topFace, this.bottomFace, this.frontFace, this.backFace, this.rightFace, this.leftFace];
    /*this.faces = this.faces.sort((face1, face2) => {

      let midPoint1 = new Vector3D((this.vertices[face1[0]].x + this.vertices[face1[2]].x) / 2 , (this.vertices[face1[0]].y + this.vertices[face1[2]].y) / 2 , (this.vertices[face1[0]].z + this.vertices[face1[2]].z) / 2);
      let midPoint2 = new Vector3D((this.vertices[face2[0]].x + this.vertices[face2[2]].x) / 2 , (this.vertices[face2[0]].y + this.vertices[face2[2]].y) / 2 , (this.vertices[face2[0]].z + this.vertices[face2[2]].z) / 2);

      let distance1 = Math.sqrt(Math.pow(midPoint1.x - camera.x, 2) + Math.pow(midPoint1.y - camera.y, 2) + Math.pow(midPoint1.z - camera.z, 2));
      let distance2 = Math.sqrt(Math.pow(midPoint2.x - camera.x, 2) + Math.pow(midPoint2.y - camera.y, 2) + Math.pow(midPoint2.z - camera.z, 2));

      return (distance1 - distance2);

    });
    this.faces.reverse();*/

  }

  drawFaces () {


    for (let face of this.faces) {

      let vertex0 = this.vertices[face[0]];

      ctx.beginPath();
      ctx.moveTo(vertex0.x, vertex0.y);

      for (let vertex = 1; vertex < face.length; vertex++)
        ctx.lineTo(this.vertices[face[vertex]].x, this.vertices[face[vertex]].y);

      /*for (let color in this.colors) 
        if (this.colors[color] == face) /*ctx.fillStyle = color;*/

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = this.edgeColor;
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

    };

  };

  drawVertices () {

    for (let vertex of this.vertices) {
      
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, this.vertexSize, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = this.vertexColor;
      ctx.fill();

    };

  };

  drawCube () {

    this.sortFaces();
    this.drawFaces();
    this.drawVertices();

  };

  rotateZ3D (theta) {

    this.rotationZ += theta;
    this.rotationZ = (this.rotationZ >= (2 * Math.PI)) ? (this.rotationZ - (2 * Math.PI)) : this.rotationZ;
    this.rotationZ = (this.rotationZ <= -(2 * Math.PI)) ? (this.rotationZ + (2 * Math.PI)) : this.rotationZ;

    let x, y;
    let originX, originY;

    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let vertex of this.vertices) {

      originX = vertex.x - this.center.x;
      originY = vertex.y - this.center.y;

      x = originX * cosTheta - originY * sinTheta;
      y = originY * cosTheta + originX * sinTheta;

      vertex.x = x + this.center.x;
      vertex.y = y + this.center.y;

    };

  };

  rotateY3D (theta) {

    this.rotationY += theta;
    this.rotationY = (this.rotationY >= (2 * Math.PI)) ? (this.rotationY - (2 * Math.PI)) : this.rotationY;
    this.rotationY = (this.rotationY <= -(2 * Math.PI)) ? (this.rotationY + (2 * Math.PI)) : this.rotationY;

    let x, z;
    let originX, originZ;

    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let vertex of this.vertices) {

      originZ = vertex.z - this.center.z;
      originX = vertex.x - this.center.x;

      z = originZ * cosTheta - originX * sinTheta;
      x = originX * cosTheta + originZ * sinTheta;

      vertex.z = z + this.center.z;
      vertex.x = x + this.center.x;

    };

  };

  rotateX3D (theta) {

    this.rotationX += theta;
    this.rotationX = (this.rotationX >= (2 * Math.PI)) ? (this.rotationX - (2 * Math.PI)) : this.rotationX;
    this.rotationX = (this.rotationX <= -(2 * Math.PI)) ? (this.rotationX + (2 * Math.PI)) : this.rotationX;

    let y, z;
    let originY, originZ;

    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let vertex of this.vertices) {

      originY = vertex.y - this.center.y;
      originZ = vertex.z - this.center.z;

      y = originY * cosTheta - originZ * sinTheta;
      z = originZ * cosTheta + originY * sinTheta;

      vertex.y = y + this.center.y;
      vertex.z = z + this.center.z;

    };

  };

  rotate (rotationForX, rotationForY, rotationForZ) {
      
      this.rotateX3D(rotationForX);
      this.rotateY3D(rotationForY);
      this.rotateZ3D(rotationForZ);

  };

  getVolume () {

    return (this.dim.width * this.dim.height * this.dim.depth);
    
  };

};


















function draw() {
  
  ctx.clearRect(-(canvas.width / 2), -(canvas.height / 2), canvas.width, canvas.height);

  //cube.rotate(0.01, 0.02, 0);
  cube.drawCube();
  perspective.drawPerspective();
  perspective.drawReferenceLines(cube);

  //requestAnimationFrame(draw);
  
};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const log = console.log;

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

// for setting origin in center
ctx.translate(center.x, center.y);

const camera = new Vector3D(0, 0, 100);

/*function sizingObjects (camera, objects) {

  let distance, magnifiedDistance;

  for (let object of objects) {

    for (let node of object.nodes) {

      distance = Maths.abs(camera.z - node.z);
      
      magnifiedDistance = distance * (1 / 25)

    };

  };

};*/

let cube = new Cube(0, 0, 0);
let perspective = new OnePointPerspective();
draw();

canvas.addEventListener("click", event => {

  let mouseX = event.clientX - center.x;
  let mouseY = event.clientY - center.y;

  cube.settingCenter(mouseX, mouseY, 0);

  draw();

});

canvas.addEventListener("mousedown", event => {});