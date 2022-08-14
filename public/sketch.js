const MODE = 1  // "FINE ART";
// const MODE = 5 // all debug messages

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

let exportPaper = PaperDimensions['Quickie']

defineColorPalettes();

let scaleRatio;
let exportRatio;
let buffer;
let canvas;
let rescaling_width;
let rescaling_height;

let PALETTE = getRandomFromList([
  "default"
]);

// let CountFeatureMin = 0.3;
// let CountFeatureMax = 2;
// let CountFeature = Math.round(getRandomFromInterval(CountFeatureMin, CountFeatureMax) * 100) / 100;
// let CountFeatureLabel = label_feature(CountFeature, CountFeatureMin, CountFeatureMax);

// let grainFeatureMin = 0.1;
// let grainFeatureMax = 1.4;
// let grainFeature = Math.round(getRandomFromInterval(grainFeatureMin, grainFeatureMax) * 100) / 100;
// let grainFeatureLabel = label_feature(grainFeature, grainFeatureMin, grainFeatureMax);

// let blurFeatureMin = 0.3;
// let blurFeatureMax = 0.7;
// let blurFeature = 0.7; Math.round(getRandomFromInterval(blurFeatureMin, blurFeatureMax) * 100) / 100;
// let blurFeatureLabel = label_feature(blurFeature, blurFeatureMin, blurFeatureMax);

// let opacityFeatureMin = 0.5;
// let opacityFeatureMax = 1.5;
// let opacityFeature = Math.round(getRandomFromInterval(opacityFeatureMin, opacityFeatureMax) * 100) / 100;
// let opacityFeatureLabel = label_feature(opacityFeature, opacityFeatureMin, opacityFeatureMax);

// let softNoiseFeature = getRandomFromList([true, false]);
// let softNoiseFeatureLabel = softNoiseFeature;

function preload() {
}

function setup() {

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);
  // setAttributes('antialias', true);

  // console.log("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();

  scaleDynamically();

  world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    gravity: [0, -9.8, 0]
  });

  body = world.add({
    type: 'sphere', // type of shape : sphere, box, cylinder 
    size: [1, 1, 1], // size of shape
    pos: [0, 0, 0], // start position in degree
    rot: [0, 0, 90], // start rotation in degree
    move: true, // dynamic or statique
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
  });

  createLayers();
  defineColorPalettes();
  defineAllAreas();
  defineAllElements();
  createAllElements();
}


function draw() {

  // orbitControl(1, 1, 0.1);
  // ambientLight(255, 255, 255);
  // ambientMaterial(255);

  // background(100);

  // update world
  world.step();

  // IS THIS NEEDED????
  // buffer.clear();
  // buffer.scale(scaleRatio);

  // buffer.background(color(colors[PALETTE].background));

  // buffer.push();
  // buffer.fill("red");
  // buffer.ellipse(30, 30, 50);
  // buffer.pop();

  // image(buffer, - width / 2, - height / 2);

  // rotateX(frameCount * 0.01);
  // rotateY(frameCount * 0.01);
  // box(50);

  // and copy position and rotation to three mesh
  // console.log(body.getPosition());
  console.log(body.getQuaternion());

  var bodyPosition = body.getPosition()

  push();
  translate(bodyPosition.x, bodyPosition.y, bodyPosition.z);
  box(bodyPosition.w)
  pop();

  // noLoop();

  // fxpreview();

  // console.log("safety check for diff resolutions same hash: " + fxrand());

}


function createLayers() {
  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  buffer = createGraphics(rescaling_width, rescaling_height);

  // lightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
}

function defineDuftOrigin() {
}

function defineDuftOrbit() {
}

function defineDuftArea() {
}

function defineDuftCounty() {

}

function defineAllAreas() {

}

function createAllElements() {

}

function defineAllElements() {
}


function defineColorPalettes() {
  colors = {
    "default": {
      // background: "#ffffff",
      // backgroundnoise: "#ffffff30",
      background: "#ebedf2",
      backgroundnoise: "#ebedf230",
      fillAll: [
        "#2c698d",
        "#bae8e8",
        "#e3f6f5"
      ],
      falllAllNoise: [
        "#2c698d",
        "#bae8e8",
        "#e3f6f5"
      ],
      duft: "#272643",
      duftNoise: "#272643",
    }
  }
}