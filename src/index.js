// these are the variables you can use as inputs to your algorithms
// console.log("fxhash: " + fxhash)   // the 64 chars hex number fed to your algorithm
// console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//

window.$fxhashFeatures = {
    "Palette": PALETTE_LABEL,
    // "Number of elements": CountFeatureLabel,
    // "Graininess": grainFeatureLabel,
    // "Blurriness": blurFeatureLabel,
    // "Opacity": opacityFeatureLabel,
    // "SoftNoise": softNoiseFeatureLabel,
}

console.info(`fxhash: %c${fxhash}`, 'font-weight: bold');

// console.log('');
console.group(`Palette: %c${PALETTE_LABEL}`, 'font-weight: bold');
// console.log("Background: " + "%c   ", `background:${colors[PALETTE].background};`);
// console.log("Dark: " + "%c   ", `background:${colors[PALETTE].fillAll[0]};`);
// console.log("Mid: " + "%c   ", `background:${colors[PALETTE].fillAll[1]};`);
// console.log("Light: " + "%c   ", `background:${colors[PALETTE].fillAll[2]};`);
// console.log("Duft: " + "%c   ", `background:${colors[PALETTE].duft};`);
console.groupEnd();

// console.log(`Count of shapes: %c${CountFeatureLabel} (${CountFeature})`, 'font-weight: bold');
// console.log(`Graininess: %c${grainFeatureLabel} (${grainFeature})`, 'font-weight: bold');
// console.log(`Blurriness: %c${blurFeatureLabel} (${blurFeature})`, 'font-weight: bold');
// console.log(`Opacity: %c${opacityFeatureLabel} (${opacityFeature})`, 'font-weight: bold');
// console.log(`Softnoise: %c${softNoiseFeatureLabel}`, 'font-weight: bold');
// console.log('');

// this code writes the values to the DOM as an example
// const containero = document.createElement("div")
// containero.innerText = `
//   random hash: ${fxhash} \n
//   some pseudo random values: [${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ... ]\n
// `
// document.body.prepend(containero)