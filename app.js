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

randomColors();
