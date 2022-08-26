// const MODE = 1  // "FINE ART";
const MODE = 5 // all debug messages

const NOISESEED = hashFnv32a(fxhash);
console.log("Noise seed: " + NOISESEED);

const HIGHRESPIXELRATIO = 4;

// convert pixel to real world physics
const conv = 10;

let canvas;
let rescaling_width;
let rescaling_height;

let timingInit

let PALETTE;
let PALETTE_LABEL;
let APPLESIZE = 1;

let RESTITUTIONMin = 0;
let RESTITUTIONMax = 1;
let RESTITUTION = Math.round(getRandomFromInterval(RESTITUTIONMin, RESTITUTIONMax) * 100) / 100;
let RESTITUTIONLabel = label_feature(RESTITUTION, RESTITUTIONMin, RESTITUTIONMax);

// let OBSTACLESSWITCH = true;
let OBSTACLESSWITCH = getRandomFromList([true, false]);
let OBSTACLESCOUNT = 5;

let LIGHTING = getRandomFromList(["Below", "Lab", "Drama", "Full"]);
// let LIGHTING = "Full";

const WAVECOUNT = 3;
const WAVEINDEXMAX = WAVECOUNT - 1;
let waveIndex = 0;

let POX1 = false;
let HIGHRES = false;

const PALETTESYSTEM = {
  "Medusa": [
    "#534438",
    "#FBE1BB",
    "#785237",
    "#926139",
  ],
  "Ierissos": [
    "#e7d3a4",
    "#ede7d1",
    "#404040",
    "#7d9bb3",
  ],
  "Niko": [
    "#211f1f",
    "#808080",
    "#c0c0c0",
    "#ffffff",
  ],
  "Fix Hellas": [
    "#A10035",
    "#FEC260",
    "#3FA796",
    "#2A0944",
  ],
  "Lasagne": [
    "#ffd1a9",
    "#ff9e79",
    "#fb6d4c",
    "#c23b22",
    "#580000",
  ],
  "Mamos": [
    "#77d8f9",
    "#624c38",
    "#cedeed",
    "#c64b62",
  ],
  "Babushka": [
    "#d8bc00",
    "#040c21",
    "#74a2c6",
    "#a43b4f",
  ],
  "Autodrom": [
    "#d8bc00",
    "#894292",
    "#67bfee",
    "#3e2543",
  ],
  "Olivenhain": [
    "	#14140a",
    "#918e41",
    "#ffc83d",
    "#4e542c",
  ],
}

choosePalette()

function choosePalette() {

  allPalettes = [];
  for (let palette in PALETTESYSTEM) {
    // console.log(palette)
    allPalettes.push(palette)
  }
  // console.log(allPalettes);
  PALETTE_LABEL = getRandomFromList(allPalettes);
  // console.log(PALETTE_LABEL);
  PALETTE = PALETTESYSTEM[PALETTE_LABEL];
}

function createPaletteColors() {

  for (let palette in PALETTESYSTEM) {
    // console.log(palette)
    for (var i = 0; i < PALETTESYSTEM[palette].length; i++) {
      // console.log(PALETTESYSTEM[palette][i])
      PALETTESYSTEM[palette][i] = color(PALETTESYSTEM[palette][i]);
    }
  }
}

function setup() {
  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);
  setAttributes('antialias', true);

  scaleDynamically();

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  canvas.id('badAssCanvas');

  createPaletteColors();
  addTexture();

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

  // start frame of the cycle
  timingInit = 0
}


function draw() {

  if (HIGHRES) {
    pixelDensity(HIGHRESPIXELRATIO);
  }


  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  if (MODE == 5) {
    camera(0, 800, 0, 0, 0, 0, 0, 0, 1); // debug - on top view
    // camera(-1500, 0, 0, 0, 0, 0, 0, -1, 0); // debug -- side view
  } else {
    camera(0, 700, 0, 0, 0, 0, 0, 0, 1);
  }

  // ambientLight(255, 255, 255);
  // ambientMaterial(255);
  // specularMaterial(255);

  if (LIGHTING == "Full") {
    ambientLight(150);
    directionalLight(200, 200, 200, 1, -1, 0);

  } else if (LIGHTING == "Drama") {

    ambientLight(50);
    pointLight(75, 75, 75, getRandomFromInterval(-50, 50), -10, getRandomFromInterval(-30, 30))
    pointLight(75, 75, 75, getRandomFromInterval(-50, 50), -10, getRandomFromInterval(-30, 30))
    pointLight(75, 75, 75, getRandomFromInterval(-50, 50), -10, getRandomFromInterval(-30, 30))
    pointLight(75, 75, 75, getRandomFromInterval(-50, 50), -10, getRandomFromInterval(-30, 30))
    pointLight(75, 75, 75, getRandomFromInterval(-50, 50), -10, getRandomFromInterval(-30, 30))

  } else if (LIGHTING == "Below") {
    ambientLight(100);
    directionalLight(180, 180, 180, 0, -1, 0); // crazy
    // directionalLight(255, 255, 255, 0, 0, -1);  // also crazy
  } else if (LIGHTING == "Lab") {
    ambientLight(50);
    directionalLight(255, 255, 255, 0, -1, -1);  // also crazy
  }


  if (MODE == 5) {
    background(100);
  }

  // update world
  world.step();

  if (typeof applesFall != "undefined") {
    applesFall.updateDisplay();
  }
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

  if (typeof obstacles != "undefined") {
    obstacles.updateDisplay();
  }

  timing(timingInit);
}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}

function drawPixelBuffer(bufferWidth, bufferHeight, baseColor, secondColor, range) {
  let buffer = createGraphics(bufferWidth, bufferHeight);

  // console.log(secondColor);

  buffer.loadPixels();
  // let baseColor = color(242, 210, 169);
  // let range = 40;

  for (let y = 0; y < buffer.height; y++) {
    for (let x = 0; x < buffer.width; x++) {
      // formula to get each pixels rgba
      let index = (x + y * buffer.width) * 4;
      if (fxrand() < 0.02) {
        // buffer.pixels[index + 0] = 50;
        // buffer.pixels[index + 1] = 50;
        // buffer.pixels[index + 2] = 50;
        buffer.pixels[index + 0] = red(secondColor);
        buffer.pixels[index + 1] = green(secondColor);
        buffer.pixels[index + 2] = blue(secondColor);
      } else if (fxrand() > 0.98) {
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

  for (var i = 0; i < PALETTE.length; i++) {

    // console.log(PALETTE[i]);
    if (i == 0) {
      var j = (PALETTE.length - 1);
    } else {
      var j = i - 1;
    }

    // size of the biggest apple, inclusive conv
    PALETTE[i]["img"] = drawPixelBuffer(
      Math.round(APPLESIZE * conv * HIGHRESPIXELRATIO),  // full size
      Math.round(APPLESIZE * conv * HIGHRESPIXELRATIO),  // full size
      PALETTE[i],
      PALETTE[j],
      25);
  }

}

function terminate() {
  console.log("Shutting down!");

  if (typeof applesFall != "undefined") {
    applesFall.killAllCall();
  }
  if (typeof apples != "undefined") {
    apples.killAllCall();
  }
  if (typeof apples2 != "undefined") {
    apples2.killAllCall();
  }
  if (typeof apples3 != "undefined") {
    apples3.killAllCall();
  }
  if (typeof obstacles != "undefined") {
    obstacles.killAllCall();
  }
  console.log("Physical body count: " + world.numRigidBodies);
}


function timing(startFrame) {

  // in frames
  let SETUP = startFrame + 1;
  let START = startFrame + 10;
  let ENDFALL = startFrame + 180;
  let PREWAVE1 = startFrame + 190;
  let WAVE1 = startFrame + 200;
  let WAVE1END = startFrame + 700;
  let PREWAVE2 = startFrame + 500;
  let WAVE2 = startFrame + 520;
  let WAVE2END = startFrame + 900;
  let PREWAVE3 = startFrame + 700;
  let WAVE3 = startFrame + 720;
  let WAVE3END = startFrame + 1100;
  let END = startFrame + 1120;

  if (frameCount == SETUP) {
    background(255);  // white background once
  }

  if (frameCount == START) {
    world.setGravity([0, -9.8, 30]);
    applesFall = new AppleSystem(100, true);
  }

  //   console.log("index: " + waveIndex);
  //   console.log("limit: " + WAVEINDEXMAX);

  if (frameCount == ENDFALL) {
    console.log("Ending Fall")
    applesFall.killAllCall();
    world.setGravity([0, -9.8, 3]);
  }

  if (frameCount == PREWAVE1) {
    console.log("Starting wave: " + waveIndex + "/" + WAVEINDEXMAX);
    apples = new AppleSystem(400);
    if (OBSTACLESSWITCH) {
      obstacles = new ObstacleSystem(OBSTACLESCOUNT); // then set position
    }
  }


  if (frameCount == WAVE1) {
    console.log("Pushers fire.");
    pushers.fire();
  }

  if (frameCount == WAVE1END) {
    apples.killAllCall();
  }

  if (frameCount == PREWAVE2) {
    waveIndex += 1;
    console.log("Starting wave: " + waveIndex + "/" + WAVEINDEXMAX);
    apples2 = new AppleSystem(200);
  }

  if (frameCount == WAVE2) {
    console.log("Pushers fire.");
    pushers.fire();
  }

  if (frameCount == WAVE2END) {
    apples2.killAllCall();
  }

  //   // colored layer or medusa text;
  //   // push();
  //   // fill(0, 0, 0, 70);
  //   // box(300, 300, 300, 500, 100, 500);
  //   // pop();


  if (frameCount == PREWAVE3) {
    waveIndex += 1;
    console.log("Starting wave: " + waveIndex + "/" + WAVEINDEXMAX);
    apples3 = new AppleSystem(200);
  }

  if (frameCount == WAVE3) {
    console.log("Pushers fire.");
    pushers.fire();
  }

  if (frameCount == WAVE3END) {
    apples3.killAllCall();
  }

  if (frameCount == END) {
    console.log("Safety: " + fxrand());
    terminate();
    noLoop();
    fxpreview();
  }

}
