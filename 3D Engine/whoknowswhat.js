// https://www.khanacademy.org/computing/computer-programming/programming-games-visualizations/programming-3d-shapes/a/rotating-3d-shapes
// https://js6450.github.io/basic-p5.html
// file:///C:/Hammad/Programs/3D%20Cube/index.html

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const log = console.log;

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

const camera = [0, 0, 50];

ctx.translate(center.x, center.y);

ctx.beginPath();
ctx.moveTo(0, -25);
ctx.lineTo(0, 25);
ctx.moveTo(-25, 0);
ctx.lineTo(25, 0);
ctx.stroke();

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

class Node {

  constructor (x, y, z) {

    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);

  };

}

class Cube {

  constructor (x, y, z, dim={
    length: 200, 
    depth: null, 
    height: null
  }) {

    if (!dim.depth && !dim.height) dim.depth = dim.height = dim.length;

    this.nodeColor = "#28A86B";
    this.edgeColor = "#2244CC";
    this.nodeSize = 5;

    this.center = new Node(x, y, z);

    // front-face top-right node
    let node0 = new Node(this.center.x + (dim.length / 2), this.center.y + (dim.height / 2), this.center.z - (dim.depth / 2));
    // front-face bottom-right node
    let node1 = new Node(this.center.x + (dim.length / 2), this.center.y - (dim.height / 2), this.center.z - (dim.depth / 2));
    // front-face top-left node
    let node2 = new Node(this.center.x - (dim.length / 2), this.center.y + (dim.height / 2), this.center.z - (dim.depth / 2));
    // front-face bottom-left node
    let node3 = new Node(this.center.x - (dim.length / 2), this.center.y - (dim.height / 2), this.center.z - (dim.depth / 2));
    // rear-face top-right node
    let node4 = new Node(this.center.x + (dim.length / 2), this.center.y + (dim.height / 2), this.center.z + (dim.depth / 2));
    // rear-face bottom-right node
    let node5 = new Node(this.center.x + (dim.length / 2), this.center.y - (dim.height / 2), this.center.z + (dim.depth / 2));
    // rear-face top-left node
    let node6 = new Node(this.center.x - (dim.length / 2), this.center.y + (dim.height / 2), this.center.z + (dim.depth / 2));
    // rear-face bottom-left node
    let node7 = new Node(this.center.x - (dim.length / 2), this.center.y - (dim.height / 2), this.center.z + (dim.depth / 2));

    this.nodes = [node0, node1, node2, node3, node4, node5, node6, node7];


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

    // order of edges doesn't matter
    //this.topFace = [0, 2, 6, 4];
    //this.bottomFace = [1, 3, 7, 5];
    this.topFace = [1, 3, 7, 5];
    this.bottomFace = [0, 2, 6, 4];
    this.frontFace = [0, 1, 3, 2];
    this.backFace = [4, 5, 7, 6];
    this.rightFace = [0, 1, 5, 4];
    this.leftFace = [2, 3, 7, 6];

    // I don't know why but the top and bottom faces are reverse

  };

  drawEdges () {

    let colors = {"red": this.topFace, "blue": this.bottomFace, "green": this.frontFace, "orange": this.backFace, "black": this.rightFace, "yellow": this.leftFace};

    // this makes the cube from individual faces

    let faces =  [this.topFace, this.bottomFace, this.frontFace, this.backFace, this.rightFace, this.leftFace];
    faces = faces.sort((face1, face2) => {

      let [face1DiagonalPoint1, face1DiagonalPoint2] = [this.nodes[face1[0]], this.nodes[face1[2]]];
      let [face2DiagonalPoint1, face2DiagonalPoint2] = [this.nodes[face2[0]], this.nodes[face2[2]]];
      let midPoint1 = [(face1DiagonalPoint1[0] + face1DiagonalPoint2[0]) / 2, (face1DiagonalPoint1[1] + face1DiagonalPoint2[1]) / 2, (face1DiagonalPoint1[2] + face1DiagonalPoint2[2]) / 2];
      let midPoint2 = [(face2DiagonalPoint1[0] + face2DiagonalPoint2[0]) / 2, (face2DiagonalPoint1[1] + face2DiagonalPoint2[1]) / 2, (face2DiagonalPoint1[2] + face2DiagonalPoint2[2]) / 2];

      let distance1 = Math.sqrt(Math.pow((camera[0] - midPoint1[0]), 2) + Math.pow((camera[1] - midPoint1[1]), 2) + Math.pow((camera[2] - midPoint1[2]), 2));
      let distance2 = Math.sqrt(Math.pow((camera[0] - midPoint2[0]), 2) + Math.pow((camera[1] - midPoint2[1]), 2) + Math.pow((camera[2] - midPoint2[2]), 2));

      return (distance1 - distance2);

    });
    faces = faces.reverse();

    for (let nodes of faces) {

      let node0 = this.nodes[nodes[0]];

      ctx.beginPath();
      ctx.moveTo(node0.x, node0.y);

      for (let node = 1; node < nodes.length; node++)
        ctx.lineTo(this.nodes[node].x, this.nodes[node].y);

      ctx.closePath();
      //ctx.lineWidth = 1;
      for (let color in colors) {
        if (colors[color] == nodes) ctx.fillStyle = color;
      };
      ctx.stroke();
      ctx.fill();

    };

    /* this makes the cube from edges
    for (let edge of this.edges) {

      let [n0, n1] = edge;
      let node0 = this.nodes[n0];
      let node1 = this.nodes[n1];

      ctx.beginPath();
      ctx.moveTo(node0[0], node0[1]);
      ctx.lineTo(node1[0], node1[1]);
      ctx.stroke();

    };*/

  };

  drawNodes () {

    for (let node of this.nodes) {

      ctx.beginPath();
      ctx.arc(node[0], node[1], this.nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = this.nodeColor;
      ctx.fill();

    };

  };

  drawCube () {

    this.drawEdges();
    this.drawNodes();

  };

  rotateZ3D (theta) {

    let x, y;
    let originX, originY;

    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let node of this.nodes) {

      originX = node.x - this.center.x;
      originY = node.y - this.center.y;

      log(originX, originY)

      x = originX * cosTheta - originY * sinTheta;
      y = originY * cosTheta + originX * sinTheta;

      node.x = x + this.center.x;
      node.y = y + this.center.y;

    };

  };

  rotateY3D (theta) {

    let x, z;
    let originX, originZ;

    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let node of this.nodes) {

      originZ = node.z - this.center.z;
      originX = node.x - this.center.x;

      z = originZ * cosTheta - originX * sinTheta;
      x = originX * cosTheta + originZ * sinTheta;

      node.z = z + this.center.z;
      node.x = x + this.center.x;

    };

  };

  rotateX3D (theta) {

    let y, z;
    let originY, originZ;

    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let node of this.nodes) {

      originY = node.y - this.center.y;
      originZ = node.z - this.center.z;

      y = originY * cosTheta - originZ * sinTheta;
      z = originZ * cosTheta + originY * sinTheta;

      node.y = y + this.center.y;
      node.z = z + this.center.z;

    };

  };

};

function draw() {
  
  ctx.clearRect(-(canvas.width / 2), -(canvas.height / 2), canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, -25);
  ctx.lineTo(0, 25);
  ctx.moveTo(-25, 0);
  ctx.lineTo(25, 0);
  ctx.stroke();

  cube.rotateX3D(0.01);
  cube.rotateY3D(0.03);
  
  cube.drawCube();

  requestAnimationFrame(draw);
  
};

let cube = new Cube(0, 0, 0);
draw()

canvas.addEventListener("click", event => cube = new Cube(event.clientX, event.clientY, 0));