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

let scaleRatio;
let exportRatio;
let canvas;
let rescaling_width;
let rescaling_height;

let conv = 10;

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
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    // belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    // collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
  });

  // console.log(ground.body);

}


function draw() {

  // orbitControl(1, 1, 0.1);

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  camera(0, 1000, 0, 0, 0, 0, 0, 0, 1);

  // ambientLight(255, 255, 255);
  // ambientMaterial(255);

  if (MODE == 5) {
    background(100);
  }

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

  apples.updateDisplay();

  ground.update();
  if (MODE == 5) {
    ground.display(color(0, 255, 0, 100));
  }


  // var groundPosition = ground.getPosition();
  // var groundQuaternionRaw = ground.getQuaternion();
  // push();
  // fill(255, 0, 0, 100);
  // translate(groundPosition.x * conv, groundPosition.y * conv, groundPosition.z * conv);
  // box(ground.shapes.width * conv, ground.shapes.height * conv, ground.shapes.depth * conv);
  // pop();

  // noLoop();

  // fxpreview();

  // console.log("safety check for diff resolutions same hash: " + fxrand());

}

function mousePressed() {
  // console.log(cam);
}


// from here: https://stackoverflow.com/questions/62457529/how-do-you-get-the-axis-and-angle-representation-of-a-quaternion-in-three-js 
function getAxisAndAngelFromQuaternion(q) {
  const angle = 2 * Math.acos(q.w);
  var s;
  if (1 - q.w * q.w < 0.000001) {
    // test to avoid divide by zero, s is always positive due to sqrt
    // if s close to zero then direction of axis not important
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
    s = 1;
  } else {
    s = Math.sqrt(1 - q.w * q.w);
  }
  return [q.x / s, q.y / s, q.z / s, angle];
}