// const MODE = 1  // "FINE ART";
const MODE = 5 // all debug messages

NOISESEED = hashFnv32a(fxhash);
// console.log("Noise seed: " + NOISESEED);

let PaperDimensions = {
  "Quickie": {
    width: 800,
    height: 800
  },
  "Stammersdorf": {
    width: 3840,
    height: 2160
  },
  "1to1": {
    width: 4000,
    height: 4000
  },
}
// convert pixel to real world physics
let conv = 10;

let exportPaper = PaperDimensions['1to1']

let scaleRatio;
let exportRatio;
let canvas;
let rescaling_width;
let rescaling_height;


function preload() {
}

function setup() {

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);
  // setAttributes('antialias', true);

  // console.log("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();

  scaleDynamically();

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  cam = createCamera();

  mova = 0;

  world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    gravity: [0, -9.8, 0]
  });

  apples = new BodySystem(10);

  ground = new Body({
    type: 'box', // type of shape : sphere, box, cylinder 
    size: [100, 10, 100], // size of shape
    pos: [0, -10, 0], // start position in degree
    rot: [0, 0, 0], // start rotation in degree
    move: false, // dynamic or statique
    density: 1000,
    friction: 0.2,
    restitution: 0.2,
    name: "ground",
    // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
  });

  pusher = new Pusher({
    type: 'box',
    size: [5, 10, 5],
    pos: [0, 0, 50], // start position in degree
    rot: [0, 60, 0],
    move: true,
    density: 1,
    kinematic: true,
    noSleep: true,
    material: 'kinematic',
  });

  // console.log(pusher);

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  camera(0, 1000, 0, 0, 0, 0, 0, 0, 1);

}


function draw() {


  orbitControl();

  // ambientLight(255, 255, 255);
  // ambientMaterial(255);

  if (MODE == 5) {
    background(100);
  }

  // update world
  world.step();

  apples.updateDisplay();

  ground.update();
  if (MODE == 5) {
    ground.display(color(0, 255, 0, 100));
  }

  // console.log(pusher.body.position); 
  // z should be halfway of ground

  pusher.move();
  pusher.update();

  if (MODE == 5) {
    pusher.display(color(0, 0, 255, 100));
  }

  // noLoop();

  // fxpreview();

  // console.log("safety check for diff resolutions same hash: " + fxrand());

}

function mousePressed() {
  // console.log(cam);
}

