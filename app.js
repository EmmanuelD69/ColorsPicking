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
    hexText.innerText = randomColor;
  });
}

let randomHex = generateHexChromaJs();
console.log(randomHex);
randomColors();
