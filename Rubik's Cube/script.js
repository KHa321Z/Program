class Cubie {
  constructor (x, y, z, len, material) {
    this.len = len;

    this.box = new THREE.Mesh(new THREE.BoxGeometry(this.len, this.len, this.len), material);
    this.line = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(this.len, this.len, this.len)), new THREE.LineBasicMaterial({color: 0x000000}));

    this.box.renderOrder = 0;
    this.line.renderOrder = 1;

    this.box.position.set(x, y, z);
    this.line.position.set(x, y, z);

    scene.add(this.box);
    scene.add(this.line);
  };
}

class Cube {
  constructor (dim=3, len=5) {

    this.len = len;
    this.dim = dim;
    this.materials = [];
    this.cubies = [];
    this.faces = [];

    // 1st: RIGHT, 2nd: LEFT, 3rd: UP, 4th: DOWN, 5th: FRONT, 6th: BACK
    // UP: Yellow; DOWN: White; FRONT: Red; LEFT: Blue; BACK: Orange; RIGHT: GREEN;
    this.cols = [
      [blk, blu, blk, wht, wht, org], 
      [blk, blu, blk, wht, wht, blk], 
      [blk, blu, blk, wht, red, blk], 
      [blk, blu, blk, blk, wht, org], 
      [blk, blu, blk, blk, wht, blk], 
      [blk, blu, blk, blk, red, blk], 
      [blk, blu, ylw, blk, blk, org], 
      [blk, blu, ylw, blk, blk, blk], 
      [blk, blu, ylw, blk, red, blk], 
      [blk, blk, blk, wht, blk, org], 
      [blk, blk, blk, wht, blk, blk], 
      [blk, blk, blk, wht, red, blk], 
      [blk, blk, blk, blk, blk, org], 
      [blk, blk, blk, blk, blk, blk], 
      [blk, blk, blk, blk, red, blk], 
      [blk, blk, ylw, blk, blk, org], 
      [blk, blk, ylw, blk, blk, blk], 
      [blk, blk, ylw, blk, red, org], 
      [grn, blk, blk, wht, blk, org], 
      [grn, blk, blk, wht, blk, blk], 
      [grn, blk, blk, wht, red, blk], 
      [grn, blk, blk, blk, blk, org], 
      [grn, blk, blk, blk, blk, blk], 
      [grn, blk, blk, blk, red, blk], 
      [grn, blk, ylw, blk, blk, org], 
      [grn, blk, ylw, blk, blk, blk], 
      [grn, blk, ylw, blk, red, blk]
    ];

    for (var i = 0; i < (Math.pow(this.dim, this.dim)); i++) {
      var mats = [];
      for (var j = 0; j < 6; j++) {
        mats.push(new THREE.MeshBasicMaterial({color: this.cols[i][j]}));
      };
      this.materials.push(mats);
    };

    this.pivot = new THREE.Object3D();
    this.targetQuaternion = new THREE.Quaternion();
    this.move = false;

  };

  drawCube () {

    var ind = 0;

    for (var i = -1; i < (this.dim - 1); i++) {
      for (var j = -1; j < (this.dim - 1); j++) {
        for (var k = -1; k < (this.dim - 1); k++) {
          var posX = i * this.len;
          var posY = j * this.len;
          var posZ = k * this.len;

          var cubie = new Cubie(posX, posY, posZ, this.len, this.materials[ind]);

          this.cubies.push(cubie);

          ind += 1;
        };
      };
    };

  };

  cubeMoves (type, angle, axis, digit) {
    this.targetQuaternion.setFromEuler(angle);

    if (type == "oneLayerMove") {
      for (var cubie of this.cubies) {
        if (Math.round(cubie.box.position[axis]) == digit) {
          this.pivot.attach(cubie.box);
          this.pivot.attach(cubie.line);
          this.faces.push(cubie);
        };
      };
    } else if (type == "twoLayerMove") {
      for (var cubie of this.cubies) {
        if ((Math.round(cubie.box.position[axis]) == digit) || (Math.round(cubie.box.position[axis]) == 0)) {
          this.pivot.attach(cubie.box);
          this.pivot.attach(cubie.line);
          this.faces.push(cubie);
        };
      };
    } else {
      for (var cubie of this.cubies) {
        this.pivot.attach(cubie.box);
        this.pivot.attach(cubie.line);
        this.faces.push(cubie);
      };
    };

    scene.add(this.pivot);
    this.move = true;

  };

  upMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, -(Math.PI / 2), 0), "y", 5);
  };

  upInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, Math.PI / 2, 0), "y", 5);
  };

  downMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, Math.PI / 2, 0), "y", -5);
  };

  downInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, -(Math.PI / 2), 0), "y", -5);
  };

  rightMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(-(Math.PI / 2), 0, 0), "x", 5);
  };

  rightInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(Math.PI / 2, 0, 0), "x", 5);
  };

  leftMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(Math.PI / 2, 0, 0), "x", -5);
  };

  leftInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(-(Math.PI / 2), 0, 0), "x", -5);
  };

  frontMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, 0, -(Math.PI / 2)), "z", 5);
  };

  frontInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, 0, Math.PI / 2), "z", 5);
  };

  backMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, 0, Math.PI / 2), "z", -5);
  };

  backInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, 0, -(Math.PI / 2)), "z", -5);
  };

  middleMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(Math.PI / 2, 0, 0), "x", 0);
  };

  middleInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(-(Math.PI / 2), 0, 0), "x", 0);
  };

  equatorMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, Math.PI / 2, 0), "y", 0);
  };

  equatorInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, -(Math.PI / 2), 0), "y", 0);
  };

  standingMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, 0, Math.PI / 2), "z", 0);
  };

  standingInvMove () {
    this.cubeMoves("oneLayerMove", new THREE.Euler(0, 0, Math.PI / 2), "z", 0);
  };

  up2LayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(0, Math.PI / 2, 0), "y", 5);
  };

  up2InvLayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(0, -(Math.PI / 2), 0), "y", 5);
  };

  down2LayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(0, Math.PI / 2, 0), "y", -5);
  };

  down2InvLayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(0, -(Math.PI / 2), 0), "y", -5);
  };

  right2LayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(Math.PI / 2, 0, 0), "x", 5);
  };

  right2InvLayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(-(Math.PI / 2), 0 , 0), "x", 5);
  };

  left2LayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(Math.PI / 2, 0, 0), "x", -5);
  };

  left2InvLayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(-(Math.PI / 2), 0, 0), "x", -5);
  };

  front2LayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(0, 0, Math.PI / 2), "z", 5);
  };

  front2InvLayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(0, 0, -(Math.PI / 2)), "z", 5);
  };

  back2LayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(0, 0, Math.PI / 2), "z", -5);
  };

  back2InvLayerMove () {
    this.cubeMoves("twoLayerMove", new THREE.Euler(0, 0, -(Math.PI / 2)), "z", -5);
  };

  xMove () {
    this.cubeMoves(null, new THREE.Euler(Math.PI / 2, 0, 0), null, null);
  };

  xInvMove () {
    this.cubeMoves(null, new THREE.Euler(-(Math.PI / 2), 0, 0), null, null);
  };

  yMove () {
    this.cubeMoves(null, new THREE.Euler(0, Math.PI / 2, 0), null, null);
  };

  yInvMove () {
    this.cubeMoves(null, new THREE.Euler(0, -(Math.PI / 2), 0), null, null);
  };

  zMove () {
    this.cubeMoves(null, new THREE.Euler(0, 0, Math.PI / 2), null, null);
  };

  zInvMove () {
    this.cubeMoves(null, new THREE.Euler(0, 0, -(Math.PI / 2)), null, null);
  };

  cubeRotation () {

    if (this.move) {

      window.removeEventListener("keydown", keyPress);

      var delta = clock.getDelta();

      if (!this.pivot.quaternion.equals(this.targetQuaternion)) {

        var step = Math.PI * delta;
        this.pivot.quaternion.rotateTowards(this.targetQuaternion, step);

      } else {

        this.move = false;
        this.pivot.updateMatrixWorld();

        for (var cubie of this.faces) {
          scene.attach(cubie.box);
          scene.attach(cubie.line);
        };

        this.faces = [];
        this.pivot = new THREE.Object3D();
        this.targetQuaternion = new THREE.Quaternion();

      };
    } else {window.addEventListener("keydown", keyPress, false)};
  };

  shuffleCube () {
    var moves = [this.down2LayerMove];

    do {
      var noOfMoves = Math.floor(Math.random() * moves.length);
    } while (noOfMoves < 10);

    console.log(noOfMoves);

    for (var i = 0; i < noOfMoves; i++) {
      var typeOfMove = Math.floor(Math.random() * moves.length);
      this.down2LayerMove();
    };
  };
};

let canvas;
let renderer, scene, camera;
let controls, clock, axesHelper;

const red = new THREE.Color(0xFF0000);
const blu = new THREE.Color(0x0000FF);
const grn = new THREE.Color(0x00FF00);
const org = new THREE.Color(0xFFA500);
const wht = new THREE.Color(0xFFFFFF);
const ylw = new THREE.Color(0xFFFF00);
const blk = new THREE.Color(0x000000);

// Creating Instance of Cube Class
rubikCube = new Cube();

init();
animate();

window.addEventListener("keydown", keyPress, false);
window.addEventListener("resize", onWindowResize, false);

function init () {

  canvas = document.getElementById("myCanvas");
  canvas.width = devicePixelRatio * canvas.clientWidth;
  canvas.height = devicePixelRatio * canvas.clientHeight;

  // Something like a Canvas for WebGl to render
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialiases: true
  });
  renderer.setClearColor(0xDDDDDD, 1);
  renderer.setPixelRatio(devicePixelRatio);

  // The Film or Scene in literal sense
  scene = new THREE.Scene();

  // POV
  camera = new THREE.PerspectiveCamera(70, canvas.width/canvas.height);
  camera.position.set(0, 0, 50);
  scene.add(camera);

  // Clock
  clock = new THREE.Clock();

  // Controls
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0, 0);
  controls.rotateSpeed = 2.0;
  controls.noZoom = true;
  controls.noPan = true;
  controls.noRotate = true;

  camera.position.y = 15;

  // Drawing the Cube
  rubikCube.drawCube();

};

// Animate Loop Function
function animate () {

  requestAnimationFrame(animate);
  rubikCube.cubeRotation();
  controls.update();
  renderer.render(scene, camera);

};

function keyPress(e) {

  var code = e.key;

  switch (code) {
    case 'w': rubikCube.upMove(); break;

    case 's': rubikCube.downMove(); break;

    case 'a': rubikCube.leftMove(); break;

    case 'd': rubikCube.rightMove(); break;

    case 'q': rubikCube.frontMove(); break;

    case 'e': rubikCube.backMove(); break;

    case 'f': rubikCube.middleMove(); break;

    case 'g': rubikCube.equatorMove(); break;

    case 'h': rubikCube.standingMove(); break;

    case 'i': rubikCube.up2LayerMove(); break;

    case 'k': rubikCube.down2LayerMove(); break;

    case 'j': rubikCube.left2LayerMove(); break;

    case 'l': rubikCube.right2LayerMove(); break;

    case 'z': rubikCube.xMove(); break;

    case 'x': rubikCube.yMove(); break;

    case 'c': rubikCube.zMove(); break;

    case 'W': rubikCube.upInvMove(); break;

    case 'S': rubikCube.downInvMove(); break;

    case 'A': rubikCube.leftInvMove(); break;

    case 'D': rubikCube.rightInvMove(); break;

    case 'Q': rubikCube.frontInvMove(); break;

    case 'E': rubikCube.backInvMove(); break;

    case 'F': rubikCube.middleInvMove(); break;

    case 'G': rubikCube.equatorInvMove(); break;

    case 'H': rubikCube.standingInvMove(); break;

    case 'I': rubikCube.up2InvLayerMove(); break;

    case 'K': rubikCube.down2InvLayerMove(); break;

    case 'J': rubikCube.left2InvLayerMove(); break;

    case 'L': rubikCube.right2InvLayerMove(); break;

    case 'Z': rubikCube.xInvMove(); break;

    case 'X': rubikCube.yInvMove(); break;

    case 'C': rubikCube.zInvMove(); break;

    case 'ArrowUp': rubikCube.xMove(); break;

    case 'ArrowDown': rubikCube.xInvMove(); break;

    case 'ArrowLeft': rubikCube.yMove(); break;

    case 'ArrowRight': rubikCube.yInvMove(); break;

    case 'Enter': rubikCube.shuffleCube(); break;
  };

};

function onWindowResize () {

  camera.aspect = canvas.clientWidth/canvas.clientHeight;
  camera.updateProjectionMatrix();

}