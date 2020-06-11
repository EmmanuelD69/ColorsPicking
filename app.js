/* Global selections et variables */

const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");

/* Fonctions */
/* Fonction permettant de générer le code Hexadecimal d'une couleur */

/* VERSION NATIVE SANS UTILISER LIBRAIRIE CHROMA JS */
// function generateHexNativeJs() {
//   const letters = "0123456789ABCDEF";
//   let hash = "#";
//   for (let i = 0; i < 6; i++) {
//     hash += letters[Math.floor(Math.random() * 16)];
//   }
//   return hash;
// }

/* VERSION UTILISANT LIBRAIRIE CHROMA JS */
function generateHexChromaJs() {
  const hexColor = chroma.random();
  return hexColor;
}

/* fonction permettant l'affichage d'une couleur ayant été généré par la fonction generateHex */
function randomColors() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHexChromaJs();
    /* add couleur au background */
    div.style.backgroundColor = randomColor;
    /* add texte pour identifier la couleur */
    hexText.innerText = randomColor;

    /* add check pour le contrast */
    checkTextConstrast(randomColor, hexText);

    /* Couleur initiale des sliders */
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
}

/* fonction permettant le controle du contraste d'une couleur de sorte d'écrire la valeur Hexadécimale de la couleur en noir ou blanc */
function checkTextConstrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.6) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  /* Paramètres pour constituer la barre de saturation */
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const echelleSat = chroma.scale([noSat, color, fullSat]);
  /* background de la barre de saturation */
  saturation.style.backgroundImage = `linear-gradient(to right,${echelleSat(
    0
  )},${echelleSat(1)})`;

  /* Paramètres pour constituer la barre de luminosité */
  const midBright = color.set("hsl.l", 0.5);
  const echelleBright = chroma.scale(["black", midBright, "white"]);
  /* background de la barre de luminosité */
  brightness.style.backgroundImage = `linear-gradient(
    to right, 
    ${echelleBright(0)}, 
    ${echelleBright(0.5)}, 
    ${echelleBright(1)})`;

  /* background de la barre de teinte */
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

randomColors();
