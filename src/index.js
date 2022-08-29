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
    "Size of particles": APPLESIZELABEL,
    "Restitution": RESTITUTIONLabel,
    "Obstacles": OBSTACLESSWITCH,
    "Lighting": LIGHTING,
}

console.info(`fxhash: %c${fxhash}`, 'font-weight: bold');

// var allColorsStrings = [];
// for (var i = 0; i < PALETTESYSTEM[PALETTE_LABEL].length; i++) {
// allColorsStrings.push(PALETTESYSTEM[PALETTE_LABEL][i]);
// `"%c   ", `background: ${ PALETTESYSTEM[PALETTE_LABEL][i] }`);
// }
// console.log(allColorsStrings);
// for (var colorString of allColorsStrings) {

// }

console.log('');
console.group(`Palette: %c${PALETTE_LABEL} `, 'font-weight: bold');
for (var i = 0; i < PALETTESYSTEM[PALETTE_LABEL].length; i++) {
    // console.log(PALETTESYSTEM[PALETTE_LABEL][i])
    console.log(`%c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL][i]}; `);
}
console.groupEnd();

console.log(`Size of particles: %c${APPLESIZELABEL} (${APPLESIZE})`, 'font-weight: bold');
console.log(`Restitution: %c${RESTITUTIONLabel} (${RESTITUTION})`, 'font-weight: bold');
console.log(`Obstacles: %c${OBSTACLESSWITCH} `, 'font-weight: bold');
console.log(`Lighting: %c${LIGHTING} `, 'font-weight: bold');
console.log('');

// this code writes the values to the DOM as an example
// const containero = document.createElement("div")
// containero.innerText = `
//   random hash: ${fxhash} \n
//   some pseudo random values: [${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ... ]\n
// `
// document.body.prepend(containero)