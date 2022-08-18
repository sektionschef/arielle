const MODE = 1  // "FINE ART";
// const MODE = 5 // all debug messages

const NOISESEED = hashFnv32a(fxhash);
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

let PALETTE;
const WAVECOUNT = 3;
const WAVEINDEXMAX = WAVECOUNT - 1;
let waveIndex = 0;

function preload() {
  // img = loadImage('sand.jpg');
}

function setup() {

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);
  // setAttributes('antialias', true);

  // console.log("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();

  scaleDynamically();

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  cam = createCamera();  // needed?

  createPalette();
  addTexture();

  world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    // gravity: [0, -9.8, 0]
    gravity: [0, -9.8, 2]
  });

  ground = new Body({
    type: 'box', // type of shape : sphere, box, cylinder 
    size: [100, 10, 100], // size of shape
    pos: [0, -10, 0], // start position in degree
    rot: [0, 0, 0], // start rotation in degree
    move: false, // dynamic or statique
    density: 1000,
    friction: 0.1,
    restitution: 0.2,
    name: "ground",
    // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
  }, { "fill": color(0, 255, 0, 100), "stroke": "black" });

  // upperBorder = new Body({
  //   type: 'box', // type of shape : sphere, box, cylinder 
  //   size: [100, 50, 10], // size of shape
  //   pos: [0, 0, -50], // start position in degree
  //   rot: [0, 0, 0], // start rotation in degree
  //   move: false, // dynamic or statique
  //   density: 1000,
  //   friction: 0.2,
  //   restitution: 0.2,
  //   name: "upperBorder",
  // }, { "fill": color(0, 155, 0, 100), "stroke": "black" });

  lowerBorder = new Body({
    type: 'box', // type of shape : sphere, box, cylinder 
    size: [100, 50, 10], // size of shape
    pos: [0, 0, 50], // start position in degree
    rot: [0, 0, 0], // start rotation in degree
    move: false, // dynamic or statique
    density: 1000,
    friction: 0.2,
    restitution: 0.2,
    name: "lowerBorder",
  }, { "fill": color(0, 155, 0, 100), "stroke": "black" });

  // leftBorder = new Body({
  //   type: 'box', // type of shape : sphere, box, cylinder 
  //   size: [10, 50, 100], // size of shape
  //   pos: [50, 0, 0], // start position in degree
  //   rot: [0, 0, 0], // start rotation in degree
  //   move: false, // dynamic or statique
  //   density: 1000,
  //   friction: 0.2,
  //   restitution: 0.2,
  //   name: "leftBorder",
  // }, { "fill": color(0, 155, 0, 100), "stroke": "black" });

  // rightBorder = new Body({
  //   type: 'box', // type of shape : sphere, box, cylinder 
  //   size: [10, 50, 100], // size of shape
  //   pos: [-50, 0, 0], // start position in degree
  //   rot: [0, 0, 0], // start rotation in degree
  //   move: false, // dynamic or statique
  //   density: 1000,
  //   friction: 0.2,
  //   restitution: 0.2,
  //   name: "leftBorder",
  // }, { "fill": color(0, 155, 0, 100), "stroke": "black" });

  pushers = new PusherSystem(ground.body.shapes.width);


  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  if (MODE == 5) {
    camera(0, 1000, 0, 0, 0, 0, 0, 0, 1); // debug
  } else {
    camera(0, 700, 0, 0, 0, 0, 0, 0, 1);
  }

  // debugMode(AXES);

  waveCycle();
}


function draw() {

  if (MODE == 5) {
    orbitControl();
  }

  // ambientLight(255, 255, 255);
  // ambientMaterial(255);
  // specularMaterial(250);

  if (waveIndex == 0) {
    ambientLight(50);
  } else if (waveIndex == 1) {
    ambientLight(100);
    directionalLight(255, 255, 255, 1, -1, 0); // from right and above
  } else {
    ambientLight(100);
    directionalLight(255, 255, 255, 1, -1, 0); // from right and above
    directionalLight(255, 255, 255, 1, -1, 0); // from right and above
  }

  if (frameCount == 1) {
    background(PALETTE.background);
  }

  if (MODE == 5) {
    background(100);
  }

  // update world
  world.step();

  if (typeof apples != "undefined") {
    apples.updateDisplay();
  }

  ground.update();
  // upperBorder.update();
  lowerBorder.update();
  // leftBorder.update();
  // rightBorder.update();

  if (MODE == 5) {
    ground.display();
    // upperBorder.display();
    lowerBorder.display();
    // leftBorder.display();
    // rightBorder.display();
  }

  pushers.updateDisplay();

  // console.log("safety check for diff resolutions same hash: " + fxrand());

}

function mousePressed() {
  // console.log(cam);
}


function createPalette() {
  const PALETTESYSTEM = {
    "Medusa": {
      "background": color("#CEA588"),
      "apples": [
        {
          "fill": color("#534438"),
          "stroke": color("#785237")
        },
        {
          "fill": color("#FBE1BB"),
          "stroke": color("#CEA588")
        },
        {
          "fill": color("#785237"),
          "stroke": color("#926139")
        },
        {
          "fill": color("#926139"),
          "stroke": color("#534438")
        }
      ]
    },
    "Ierissos": {
      "background": color("#cfbb95"),
      "apples": [
        {
          "fill": color("#e7d3a4"),
          "stroke": color("#ede7d1")
        },
        {
          "fill": color("#ede7d1"),
          "stroke": color("#e7d3a4")
        },
        {
          "fill": color("#bed4e4"),
          "stroke": color("#9ebdd5")
        },
        {
          "fill": color("#9ebdd5"),
          "stroke": color("#bed4e4")
        }
      ]
    },
    "Niko": {
      "background": color("#404040"),
      "apples": [
        {
          "fill": color("#00000010"),
          "stroke": color("#80808010")
        },
        {
          "fill": color("#80808010"),
          "stroke": color("#00000010")
        },
        {
          "fill": color("#c0c0c010"),
          "stroke": color("#ffffff10")
        },
        {
          "fill": color("#ffffff10"),
          "stroke": color("#c0c0c010")
        }
      ]
    },

  }

  PALETTE = PALETTESYSTEM['Niko'];
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
      buffer.pixels[index + 0] = random(red(baseColor) - range, red(baseColor) + range);
      buffer.pixels[index + 1] = random(green(baseColor) - range, green(baseColor) + range);
      buffer.pixels[index + 2] = random(blue(baseColor) - range, blue(baseColor) + range);
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
      20,
      20,
      PALETTE['apples'][i].fill,
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
  noLoop();
  fxpreview();
}

async function waveCycle() {

  console.log("index: " + waveIndex);
  console.log("limit: " + WAVEINDEXMAX);
  if (waveIndex > WAVEINDEXMAX) {
    terminate()
    return;
  }

  console.log("Cycle starting");
  if (waveIndex == 0) {
    var appleNumber = 300;
  } else if ((waveIndex == 1)) {
    var appleNumber = 300;
  } else {
    var appleNumber = 300;
  }
  // apples = new AppleSystem(appleNumber);
  apples = new AppleSystem(400);

  await sleep(1000 * 60 * 0.01);
  // await sleep(1000 * 60 * 0.01);  // fast

  console.log("Fire");
  pushers.fire();

  // repeat
  await sleep(1000 * 60 * 0.2);

  // colored layer;
  // push();
  // fill(0, 0, 0, 70);
  // box(300, 300, 300, 500, 100, 500);
  // pop();

  waveIndex += 1;
  waveCycle();
}
