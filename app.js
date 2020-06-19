/*** SELECTIONS ET VARIABLES ***/
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const openAdjustBtn = document.querySelectorAll(".adjust");
const closeAdjustmentBtn = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
const lockBtn = document.querySelectorAll(".lock");
const clearBtn = document.querySelector(".clear-library");
const libraryPopup = document.querySelector(".library-popup");
/* Pour sauvegarder les couleurs initiales */
let couleurInitiale;
/* pour utiliser avec local storage */
let savedPalettes = [];

/*** AJOUT DES EVENTS LISTENERS ***/
/* à l'écoute d'un changement sur les sliders */
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

/* bouton "generate" qui lance la fonction randomColors à chaque click */
generateBtn.addEventListener("click", randomColors);

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextColor(index);
  });
});

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});

popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});

openAdjustBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});

closeAdjustmentBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});

lockBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    lockCouleur(index);
    if (button.parentElement.parentElement.classList.contains("locked")) {
      button.innerHTML = `<i class="fas fa-lock"></i>`;
    } else {
      button.innerHTML = `<i class="fas fa-lock-open"></i>`;
    }
  });
});

// clearBtn.addEventListener("click", () => {
//   localStorage.clear();
//   closeLibrary();
//   removeAll();
// });

// function removeAll() {
//   let test = document.getElementsByClassName("custom-palette");
//   console.log(test);
//   test.forEach((entry, index) => {
//     let c = libraryPopup.removeChild(test[0]);
//   });
// }

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
    if (div.classList.contains("locked")) {
      couleurInitiale.push(hexText.innerText);
      return;
    } else {
      couleurInitiale.push(chroma(randomColor).hex());
    }

    /* add couleur au background */
    div.style.backgroundColor = randomColor;

    /* add texte pour identifier la couleur */
    hexText.innerText = randomColor;

    /* add check pour le contrast du texte */
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

  /* add check pour le contrast des icones */
  openAdjustBtn.forEach((button, index) => {
    checkTextConstrast(couleurInitiale[index], button);
    checkTextConstrast(couleurInitiale[index], lockBtn[index]);
  });
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

function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  /* déclenchement de l'animation de la fenêtre popup */
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
  sliderContainers[index].classList.toggle("active");
}
function closeAdjustmentPanel(index) {
  sliderContainers[index].classList.remove("active");
}
function lockCouleur(index) {
  colorDivs[index].classList.toggle("locked");
}

/* Mise en place de la Sauvegarde et du Local Storage pour les palettes de couleurs */
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

/* Event listener pour save button */
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);
submitSave.addEventListener("click", savePalette);

function openPalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}
function closePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}
function openLibrary(e) {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}
function closeLibrary(e) {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}

function savePalette(e) {
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const name = saveInput.value;
  const colors = [];
  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });

  /* Création de l'objet qui va stocker la palette de couleurs */
  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  if (paletteObjects) {
    paletteNr = paletteObjects.length;
  } else {
    paletteNr = savedPalettes.length;
  }

  const paletteObj = { name, colors, nr: paletteNr };
  savedPalettes.push(paletteObj);

  /* sauvegarde de l'objet dans le local storage */
  saveToLocalStorage(paletteObj);
  saveInput.value = "";

  /* création du popup de la bibliothèque */
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = paletteObj.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.colors.forEach((smallColor) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  });

  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "select";

  /* bouton "select" */
  paletteBtn.addEventListener("click", (e) => {
    closeLibrary();
    const paletteIndex = e.target.classList[1];
    couleurInitiale = [];
    savedPalettes[paletteIndex].colors.forEach((color, index) => {
      couleurInitiale.push(color);
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      checkTextConstrast(color, text);
      updateTextColor(index);
    });
    resetInputs();
  });

  /* ajout des sélections sauvegardés à la bibliothèque  */
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
}

function saveToLocalStorage(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function getFromLocalStorage() {
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    savedPalettes = [...paletteObjects];
    paletteObjects.forEach((paletteObj) => {
      /* création du popup de la bibliothèque */
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = paletteObj.name;
      const preview = document.createElement("div");
      preview.classList.add("small-preview");
      paletteObj.colors.forEach((smallColor) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });

      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.nr);
      paletteBtn.innerText = "select";

      /* bouton "select" */
      paletteBtn.addEventListener("click", (e) => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        couleurInitiale = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
          couleurInitiale.push(color);
          colorDivs[index].style.backgroundColor = color;
          const text = colorDivs[index].children[0];
          checkTextConstrast(color, text);
          updateTextColor(index);
        });
        resetInputs();
      });

      /* ajout des sélections sauvegardés à la bibliothèque  */
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette);
    });
  }
}

getFromLocalStorage();
randomColors();
