// das vordere bleibt, das hintere filtert alles raus, wo im zweiten keine transparenz hat
function maskBuffers(textureBuffer, shapeBuffer) {
    var maskedBuffer;
    (maskedBuffer = textureBuffer.get()).mask(shapeBuffer.get());
    return maskedBuffer
}

function getRandomFromInterval(min, max) {
    return fxrand() * (max - min) + min;
}

function getRealRandomFromInterval(min, max) {
    return random() * (max - min) + min;
}

function getRandomFromList(items) {
    return items[Math.floor(fxrand() * items.length)];
}

function distortColor(colorObject, max_diff) {
    if (typeof max_diff == "undefined") {
        max_diff = 10;
    }
    let red = (colorObject.levels[0] + getRandomFromInterval(-max_diff, max_diff));
    let green = (colorObject.levels[1] + getRandomFromInterval(-max_diff, max_diff));
    let blue = (colorObject.levels[2] + getRandomFromInterval(-max_diff, max_diff));
    let opacity = colorObject.levels[3];

    // not larger than 255 and not smaller than 0
    red = Math.min(Math.max(parseInt(red), 0), 255);
    green = Math.min(Math.max(parseInt(green), 0), 255);
    blue = Math.min(Math.max(parseInt(blue), 0), 255);

    return color(red, green, blue, opacity);
}

function brightenColor(colorObject, diff) {

    colorMode(HSB);
    brightnessNew = brightness(colorObject) + getRandomFromInterval(-diff, diff);
    resultingColor = color(hue(colorObject), saturation(colorObject), brightnessNew);

    // let diff_constant = getRandomFromInterval(-diff, diff)
    // let red = (colorObject.levels[0] + diff_constant);
    // let green = (colorObject.levels[1] + diff_constant);
    // let blue = (colorObject.levels[2] + diff_constant);
    // let opacity = colorObject.levels[3];

    // // not larger than 255 and not smaller than 0
    // red = Math.min(Math.max(parseInt(red), 0), 255);
    // green = Math.min(Math.max(parseInt(green), 0), 255);
    // blue = Math.min(Math.max(parseInt(blue), 0), 255);

    // return color(red, green, blue, opacity);
    colorMode(RGB);
    // return colorObject
    return resultingColor
}

function brightenColorStatic(colorObject, diff) {
    colorMode(HSB);
    brightnessNew = brightness(colorObject) + diff;
    resultingColor = color(hue(colorObject), saturation(colorObject), brightnessNew);
    colorMode(RGB);
    return resultingColor
}

function saturateColorStatic(colorObject, diff) {
    colorMode(HSB);
    saturationNew = saturation(colorObject) + diff;
    resultingColor = color(hue(colorObject), saturationNew, brightness(colorObject));
    colorMode(RGB);
    return resultingColor
}

function lessenColor(colorObject, diff) {
    let diff_constant = getRandomFromInterval(0, -diff)
    let red = colorObject.levels[0];
    let green = colorObject.levels[1];
    let blue = colorObject.levels[2];
    // let opacity = (colorObject.levels[3] - diff_constant);
    let opacity = constrain(colorObject.levels[3] + diff_constant, 0, 255);

    return color(red, green, blue, opacity);
}

function fromHSBtoRGB(colorObject) {
    colorMode(RGB);
    return color(red(colorObject), green(colorObject), blue(colorObject));
}

// calculate the scaling params - choose the limiting factor either height or width
function scaleDynamicallyPaper() {

    const GOAL = 4000;

    // scaleRatio = 1;
    dynamicWidthRatio = GOAL / windowWidth;
    dynamicHeightRatio = GOAL / windowHeight;

    if (dynamicWidthRatio > dynamicHeightRatio) {
        // console.log("Width is smaller than height. Width dominates")
        exportRatio = dynamicWidthRatio;
    } else {
        // console.log("width is larger than height. Height dominates.")
        exportRatio = dynamicHeightRatio;
    }
    if (MODE > 1) {
        console.log("Display density: " + displayDensity());
        console.log("Pixel density: " + pixelDensity())
    }
    exportRatio /= pixelDensity();
    if (MODE > 1) {
        console.log("exportRatio: " + exportRatio);
    }


    rescaling_width = Math.floor(GOAL / exportRatio);
    rescaling_height = Math.floor(GOAL / exportRatio);
}

function scaleDynamically() {

    if (windowHeight > windowWidth) {
        if (MODE > 1) {
            console.log("Width is smaller than height. Width dominates")
        }
        rescaling_width = Math.floor(windowWidth);
        rescaling_height = Math.floor(windowWidth);
    } else {
        if (MODE > 1) {
            console.log("width is larger than height. Height dominates.")
        }
        rescaling_width = Math.floor(windowHeight);
        rescaling_height = Math.floor(windowHeight);
    }

}

// each time window.innerWidth changes
function windowResized() {
    // console.log("Window is resized.");
    window.location.reload();
    scaleDynamically();
}

function keyTyped() {
    if (key === 'e' || key == 'E') {
        // exportHighResolution();  // paper
        exportCanvas(canvas);  // webgl
    }
}


function label_feature(value, min, max) {
    let label;
    let third = (max - min) / 3

    if (value < (min + third)) {
        label = "low"
    } else if (value < min + third * 2) {
        label = "medium"
    } else {
        label = "high"
    }
    return label
}


function hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false  https://www.codegrepper.com/code-examples/javascript/js+hash+string+to+number */
    var i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}


function exportHighResolution() {
    // scaleRatio = exportRatio;

    // Re-create buffer with exportRatio and re-draw
    buffer = createGraphics(exportRatio * width, exportRatio * height);

    draw();

    exportCanvas(buffer);

    // Reset scaleRation back to 1, re-create buffer, re-draw
    // scaleRatio = 1;
    buffer = createGraphics(width, height);
    draw();
}

function exportCanvas(canvasName) {

    // window.location.reload();
    // Get timestamp to name the ouput file
    let timestamp = getTimestamp();

    save(canvasName, fxhash + "_" + timestamp, 'png');
}

function getTimestamp() {
    // from: https://www.kindacode.com/article/javascript-get-current-date-time-in-yyyy-mm-dd-hh-mm-ss-format/

    const dateObj = new Date;
    // console.log(dateObj);

    let year = dateObj.getFullYear();

    let month = dateObj.getMonth();
    month = ('0' + month).slice(-2);
    // To make sure the month always has 2-character-format. For example, 1 => 01, 2 => 02

    let date = dateObj.getDate();
    date = ('0' + date).slice(-2);
    // To make sure the date always has 2-character-format

    let hour = dateObj.getHours();
    hour = ('0' + hour).slice(-2);
    // To make sure the hour always has 2-character-format

    let minute = dateObj.getMinutes();
    minute = ('0' + minute).slice(-2);
    // To make sure the minute always has 2-character-format

    let second = dateObj.getSeconds();
    second = ('0' + second).slice(-2);
    // To make sure the second always has 2-character-format

    // const timestamp = `${year}/${month}/${date} ${hour}:${minute}:${second}`;
    const timestamp = `${year}${month}${date} ${hour}${minute}${second}`;

    return timestamp
}