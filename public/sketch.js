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

  // IS THIS NEEDED????
  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(color(colors[PALETTE].background));

  buffer.push();
  buffer.fill("red");
  buffer.ellipse(30, 30, 50);
  buffer.pop();

  image(buffer, - width / 2, - height / 2);

  noLoop();
  fxpreview()

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