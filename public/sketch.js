const MODE = 1  // "FINE ART";
// const MODE = 5 // all debug messages

const NOISESEED = hashFnv32a(fxhash);
console.log("Noise seed: " + NOISESEED);

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
const conv = 10;

let exportPaper = PaperDimensions['1to1']

let scaleRatio;
let exportRatio;
let canvas;
let rescaling_width;
let rescaling_height;

let PALETTE;
const WAVECOUNT = 3;
const WAVEINDEXMAX = WAVECOUNT - 1;
let waveIndex = 0;
LIGHT = "dark";

let POX1 = false;

function preload() {
  // img = loadImage('download.png');
}

function setup() {
  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);
  // setAttributes('antialias', true);

  // console.log("Pixel density: " + pixelDensity())
  // exportRatio /= pixelDensity();

  scaleDynamically();

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  canvas.id('badAssCanvas');
  cam = createCamera();  // needed?

  createPalette();
  addTexture();

  backgroundImage = drawPixelBuffer(
    100 * conv,
    100 * conv,
    PALETTE.background,
    10
  );

  world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    // random: false,  // randomize sample
    info: false,   // calculate statistic or not
    // gravity: [0, -9.8, 0]
    gravity: [0, -9.8, 3]
  });

  ground = new Body({
    type: 'box', // type of shape : sphere, box, cylinder 
    size: [100, 10, 100], // size of shape
    pos: [0, -20, 0], // start position in degree
    rot: [0, 0, 0], // start rotation in degree
    move: false, // dynamic or statique
    density: 1000,
    friction: 0.6,
    restitution: 0,
    name: "ground",
    // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
  }, color(0, 255, 0, 100));

  lowerBorder = new Body({
    type: 'box', // type of shape : sphere, box, cylinder 
    size: [100, 50, 10], // size of shape
    pos: [0, 0, 55], // start position in degree
    rot: [0, 0, 0], // start rotation in degree
    move: false, // dynamic or statique
    density: 1000,
    friction: 0.2,
    restitution: 0.2,
    name: "lowerBorder",
  }, color(0, 155, 0, 100));

  pushers = new PusherSystem(ground.body.shapes.width);

  // obstacles = new ObstacleSystem(5); // then set position

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  if (MODE == 5) {
    camera(0, 800, 0, 0, 0, 0, 0, 0, 1); // debug - on top view
    // camera(-1500, 0, 0, 0, 0, 0, 0, -1, 0); // debug -- side view
  } else {
    camera(0, 700, 0, 0, 0, 0, 0, 0, 1);
  }

  // debugMode(AXES);

  AllWaveCycles();  // async in setup not draw

  // oimo library random
  // console.log(OIMO.Math.rand(0, 1));
  // console.log(OIMO.Math.random());
  // console.log(OIMO.Math.randInt(0, 10));
}


function draw() {

  if (MODE == 5) {
    // orbitControl();
  }

  // ambientLight(255, 255, 255);
  // ambientMaterial(255);
  // specularMaterial(255);

  if (LIGHT == "full") {
    ambientLight(150);
    directionalLight(200, 200, 200, 1, -1, 0);
  } else if (LIGHT == "dark") {
    ambientLight(150);
  }

  // pointLight(255, 255, 255, getRandomFromInterval(-50, 50), 0, getRandomFromInterval(-30, 30))


  if (MODE == 5) {
    background(100);
  }

  if (frameCount == 1) {
    // background(PALETTE.background);
    push()
    translate(0, -15 * conv, 0);
    rotateX(PI / 2);
    texture(backgroundImage, 0, 0);
    noStroke();
    plane(backgroundImage.width, backgroundImage.height);
    pop();
  }

  // update world
  world.step();

  if (typeof apples != "undefined") {
    apples.updateDisplay();
  }
  if (typeof apples2 != "undefined") {
    apples2.updateDisplay();
  }
  if (typeof apples3 != "undefined") {
    apples3.updateDisplay();
  }


  ground.update();
  lowerBorder.update();

  if (MODE == 5) {
    ground.display();
    lowerBorder.display();
  }

  pushers.updateDisplay();

  if (frameCount == 300) {
    POX1 = true;
  }

  if (POX1) {
    console.log("please once");
    POX1 = false;
  }
}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}


function createPalette() {
  const PALETTESYSTEM = {
    "Medusa": {
      "background": color("#CEA588"),
      "apples": [
        color("#534438"),
        color("#FBE1BB"),
        color("#785237"),
        color("#926139"),
      ]
    },
    "Ierissos": {
      "background": color("#bed4e4"),
      "apples": [
        color("#e7d3a4"),
        color("#ede7d1"),
        color("#404040"),
        color("#7d9bb3"),
      ]
    },
    "Niko": {
      "background": color("#404040"),
      "apples": [
        color("#211f1f"),
        color("#808080"),
        color("#c0c0c0"),
        color("#ffffff"),
      ]
    },
    "Fix Hellas": {
      "background": color("#555c5b1"),
      "apples": [
        color("#A10035"),
        color("#FEC260"),
        color("#3FA796"),
        color("#2A0944"),
      ]
    },
    "Lasagne": {
      "background": color("#8a0000"),
      "apples": [
        color("#ffd1a9"),
        color("#ff9e79"),
        color("#fb6d4c"),
        color("#c23b22"),
        color("#580000"),
      ]
    },
    "Mamos": {
      "background": color("#f5eee4"),
      "apples": [
        color("#77d8f9"),
        color("#624c38"),
        color("#cedeed"),
        color("#c64b62"),
      ]
    },
    "Babushka": {
      "background": color("#9ebbc1"),
      "apples": [
        color("#d8bc00"),
        color("#040c21"),
        color("#74a2c6"),
        color("#a43b4f"),
      ]
    },
    "Autodrom": {
      "background": color("#657582"),
      "apples": [
        color("#d8bc00"),
        color("#894292"),
        color("#67bfee"),
        color("#3e2543"),
      ]
    },
    "Olivenhain": {
      "background": color("#919079"),
      "apples": [
        color("	#14140a"),
        color("#918e41"),
        color("#ffc83d"),
        color("#4e542c"),
      ]
    },
  }

  PALETTE = PALETTESYSTEM['Olivenhain'];
}

function drawPixelBuffer(bufferWidth, bufferHeight, baseColor, range) {
  let buffer = createGraphics(bufferWidth, bufferHeight);

  buffer.loadPixels();
  // let baseColor = color(242, 210, 169);
  // let range = 40;

  for (let y = 0; y < buffer.height; y++) {
    for (let x = 0; x < buffer.width; x++) {
      // formula to get each pixels rgba
      let index = (x + y * buffer.width) * 4;
      if (fxrand() < 0.01) {
        buffer.pixels[index + 0] = 50;
        buffer.pixels[index + 1] = 50;
        buffer.pixels[index + 2] = 50;
      } else if (fxrand() > 0.99) {
        buffer.pixels[index + 0] = 200;
        buffer.pixels[index + 1] = 200;
        buffer.pixels[index + 2] = 200;
      } else {
        buffer.pixels[index + 0] = random(red(baseColor) - range, red(baseColor) + range);
        buffer.pixels[index + 1] = random(green(baseColor) - range, green(baseColor) + range);
        buffer.pixels[index + 2] = random(blue(baseColor) - range, blue(baseColor) + range);
      }
      buffer.pixels[index + 3] = 255;
    }
  }
  buffer.updatePixels();
  return buffer
}

function addTexture() {

  for (var i = 0; i < PALETTE['apples'].length; i++) {

    // console.log(PALETTE['apples'][i]);

    // size of the biggest apple, inclusive conv
    PALETTE['apples'][i]["img"] = drawPixelBuffer(
      1 * conv,
      1 * conv,
      PALETTE['apples'][i],
      20);
  }

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
  // return Promise.resolve();
}


function terminate() {
  console.log("Shutting down!");
  apples.killAllCall();
  apples2.killAllCall();
  // apples.killAllCall();
  noLoop();
  fxpreview();
}

async function waveCycle(bodiesObject, waitTime) {
  console.log("Pushers fire.");
  await sleep(1000 * 60 * 0.01);
  pushers.fire();
  await sleep(1000 * 60 * waitTime);
  bodiesObject.killAllCall();
}

async function AllWaveCycles() {

  console.log("index: " + waveIndex);
  console.log("limit: " + WAVEINDEXMAX);

  LIGHT = "dark";
  directionalLight(200, 200, 200, 1, -1, 0);
  console.log("Initial fall");
  world.setGravity([0, -9.8, 30]);
  apples = new AppleSystem(400, true);
  await sleep(1000 * 7);
  world.setGravity([0, -9.8, 3]);
  console.log("Cycle starting");

  LIGHT = "full";
  waveCycle(apples, 0.2);

  // debug
  // console.log("body count: " + world.numRigidBodies);

  await sleep(1000 * 60 * 0.1);
  waveIndex += 1;
  console.log("index: " + waveIndex);
  console.log("limit: " + WAVEINDEXMAX);
  apples2 = new AppleSystem(200);
  waveCycle(apples2, 0.1);

  await sleep(1000 * 60 * 0.05);
  waveIndex += 1;
  console.log("index: " + waveIndex);
  console.log("limit: " + WAVEINDEXMAX);
  apples3 = new AppleSystem(100);
  waveCycle(apples3, 0.1);
  await sleep(1000 * 60 * 0.03);

  // colored layer or medusa text;
  // push();
  // fill(0, 0, 0, 70);
  // box(300, 300, 300, 500, 100, 500);
  // pop();

  console.log("stat?: " + fxrand());
  terminate();

}
