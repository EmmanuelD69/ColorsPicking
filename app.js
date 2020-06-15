/*** SELECTIONS ET VARIABLES ***/
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let couleurInitiale;

/*** AJOUT DES EVENTS LISTENERS ***/
/* à l'écoute d'un changement sur les sliders */
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextColor(index);
  });
});

/*** FONCTIONS ***/
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
  couleurInitiale = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHexChromaJs();
    /* sauvegarde des couleurs d'origine dans la variable "couleurInitiales" */
    couleurInitiale.push(chroma(randomColor).hex());
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

  /* Reset Inputs */
  resetInputs();
}

/* fonction permettant le controle du contraste d'une couleur de sorte d'écrire la valeur Hexadécimale de la couleur en noir ou blanc */
function checkTextConstrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  /* Paramètres pour constituer la barre de saturation (hsl = hue-saturation-luminescence) */
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

function hslControls(e) {
  /* récupération de l'index du slider que l'on touche */
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat");

  /* identification du slider touché en fonction de son parent */
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const teinte = sliders[0];
  const luminosité = sliders[1];
  const saturation = sliders[2];

  /* récupération de la valeur de la couleur d'origine affiché dans la div que l'on modifie */
  const bgColor = couleurInitiale[index];

  /* valeur finale de la couleur après modification avec sliders */
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", luminosité.value)
    .set("hsl.h", teinte.value);

  /* affichage de la couleur en fond */
  colorDivs[index].style.backgroundColor = color;

  /* updating la couleur de fond des sliders quand on modifie la luminosité et/ou le contraste */
  colorizeSliders(color, teinte, luminosité, saturation);
}

function updateTextColor(index) {
  /* récupération des données identifiant la Div active, la couleur de son background, le texte qu'elle affiche et les boutons qui permette sa modification */
  const activeDiv = colorDivs[index];
  /* chroma fournit un objet avec les valeurs RGB d'une couleur */
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  /* .hex() convertie une valeur en Hexadecimal */
  textHex.innerText = color.hex();
  /* controle et adapte la couleur du texte et des icons en fonction du contraste */
  checkTextConstrast(color, textHex);
  for (icon of icons) {
    checkTextConstrast(color, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = couleurInitiale[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = couleurInitiale[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = couleurInitiale[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

randomColors();
