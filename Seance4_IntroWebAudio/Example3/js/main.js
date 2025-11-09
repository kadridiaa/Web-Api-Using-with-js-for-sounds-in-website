// default imports of classes from waveformdrawer.js and trimbarsdrawer.js
import WaveformDrawer from './waveformdrawer.js';
import TrimbarsDrawer from './trimbarsdrawer.js';
// "named" imports from utils.js and soundutils.js
import { loadAndDecodeSound, playSound } from './soundutils.js';
import { pixelToSeconds } from './utils.js';

// The AudioContext object is the main "entry point" into the Web Audio API
let ctx;
let soundURLs = []; // rempli dynamiquement depuis l'API

let decodedSound; // current decoded sound
let canvas, canvasOverlay;
let waveformDrawer, trimbarsDrawer;
let mousePos = { x: 0, y: 0 };

// Main play button
let playButton = document.querySelector("#playButton");
playButton.disabled = true;

const baseURL = "http://localhost:3000"; // serveur Node.js

window.onload = async function init() {
  ctx = new AudioContext();

  canvas = document.querySelector("#myCanvas");
  canvasOverlay = document.querySelector("#myCanvasOverlay");

  waveformDrawer = new WaveformDrawer();
  trimbarsDrawer = new TrimbarsDrawer(canvasOverlay, 100, 200);

  const buttonsContainer = document.querySelector("#buttonsContainer");
  const presetSelect = document.querySelector("#presetSelect");

  let allButtons = []; // on garde une référence à tous les boutons

  // Récupérer la liste des presets depuis l'API
  let presets = [];
  try {
    const response = await fetch(`${baseURL}/api/presets`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    presets = await response.json();
  } catch (err) {
    console.error("Erreur fetch presets :", err);
    return;
  }

  // Remplir le menu déroulant
  presets.forEach((preset, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = preset.name;
    presetSelect.appendChild(option);
  });

  // Fonction pour charger un preset donné
  const loadPreset = (presetIndex) => {
    const preset = presets[presetIndex];
    if (!preset) return;

    // Construit les URLs complètes vers le serveur Node
    soundURLs = preset.samples.map(s => `${baseURL}/presets/${s.url.replace(/^\.\//, '')}`);

    // Supprime les anciens boutons
    buttonsContainer.innerHTML = "";
    allButtons = [];

    soundURLs.forEach((url, index) => {
      const btn = document.createElement("button");
      btn.textContent = preset.samples[index].name || `Sound ${index + 1}`;
      btn.style.margin = "5px";
      btn.className = "soundButton";
      buttonsContainer.appendChild(btn);
      allButtons.push(btn);

      btn.onclick = async function () {
        if (ctx.state === "suspended") await ctx.resume();

        // Réinitialiser le style de tous les boutons
        allButtons.forEach(b => {
          b.style.backgroundColor = "";
          b.style.color = "";
        });

        // Mettre en surbrillance le bouton sélectionné
        btn.style.backgroundColor = "#83E83E";
        btn.style.color = "black";
        btn.style.fontWeight = "bold";

        playButton.disabled = true;
        console.log("Chargement du son :", url);

        try {
          decodedSound = await loadAndDecodeSound(url, ctx);
        } catch (err) {
          console.error("Erreur chargement son :", err);
          return;
        }

        // Effacer la waveform précédente
        let ctxCanvas = canvas.getContext("2d");
        ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner la nouvelle waveform
        waveformDrawer.init(decodedSound, canvas, '#83E83E');
        waveformDrawer.drawWave(0, canvas.height);

        // Réinitialiser les trim bars
        trimbarsDrawer.leftTrimBar.x = 100;
        trimbarsDrawer.rightTrimBar.x = 200;

        playButton.disabled = false;
      };
    });
  };

  // Charger le premier preset par défaut
  if (presets.length > 0) loadPreset(0);

  // Changement de preset via menu déroulant
  presetSelect.onchange = (e) => loadPreset(parseInt(e.target.value));

  // Lecture du son avec les trimbars
  playButton.onclick = async function () {
    if (!decodedSound) return;
    if (ctx.state === "suspended") await ctx.resume();

    let start = pixelToSeconds(trimbarsDrawer.leftTrimBar.x, decodedSound.duration, canvas.width);
    let end = pixelToSeconds(trimbarsDrawer.rightTrimBar.x, decodedSound.duration, canvas.width);
    console.log("Lecture du son de " + start + "s à " + end + "s");

    playSound(ctx, decodedSound, start, end);
  };

  // Gestion de la souris pour les trimbars
  canvasOverlay.onmousemove = (evt) => {
    let rect = canvas.getBoundingClientRect();
    mousePos.x = (evt.clientX - rect.left);
    mousePos.y = (evt.clientY - rect.top);
    trimbarsDrawer.moveTrimBars(mousePos);
  };

  canvasOverlay.onmousedown = () => trimbarsDrawer.startDrag();
  canvasOverlay.onmouseup = () => trimbarsDrawer.stopDrag();

  // Boucle d’animation
  requestAnimationFrame(animate);
};

// Animation loop pour les trimbars
function animate() {
  trimbarsDrawer.clear();
  trimbarsDrawer.draw();
  requestAnimationFrame(animate);
}