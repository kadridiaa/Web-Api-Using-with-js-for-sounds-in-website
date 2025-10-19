// default imports of classes from waveformdrawer.js and trimbarsdrawer.js
import WaveformDrawer from './waveformdrawer.js';
import TrimbarsDrawer from './trimbarsdrawer.js';
// "named" imports from utils.js and soundutils.js
import { loadAndDecodeSound, playSound } from './soundutils.js';
import { pixelToSeconds } from './utils.js';

// The AudioContext object is the main "entry point" into the Web Audio API
let ctx;

const soundURLs = [
  'https://mainline.i3s.unice.fr/mooc/shoot2.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/a/a3/Hardstyle_kick.wav',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c7/Redoblante_de_marcha.ogg/Redoblante_de_marcha.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c9/Hi-Hat_Cerrado.ogg/Hi-Hat_Cerrado.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/07/Hi-Hat_Abierto.ogg/Hi-Hat_Abierto.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3c/Tom_Agudo.ogg/Tom_Agudo.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a4/Tom_Medio.ogg/Tom_Medio.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8d/Tom_Grave.ogg/Tom_Grave.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/68/Crash.ogg/Crash.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/24/Ride.ogg/Ride.ogg.mp3'
];

let decodedSound; // current decoded sound
let canvas, canvasOverlay;
let waveformDrawer, trimbarsDrawer;
let mousePos = { x: 0, y: 0 };

// Main play button
let playButton = document.querySelector("#playButton");
playButton.disabled = true;

window.onload = async function init() {
  ctx = new AudioContext();

  canvas = document.querySelector("#myCanvas");
  canvasOverlay = document.querySelector("#myCanvasOverlay");

  waveformDrawer = new WaveformDrawer();
  trimbarsDrawer = new TrimbarsDrawer(canvasOverlay, 100, 200);

  // Crée les boutons dynamiquement
  const buttonsContainer = document.querySelector("#buttonsContainer");
  let allButtons = []; // on garde une référence à tous les boutons

  soundURLs.forEach((url, index) => {
    const btn = document.createElement("button");
    btn.textContent = "Sound " + (index + 1);
    btn.style.margin = "5px";
    btn.className = "soundButton";
    buttonsContainer.appendChild(btn);
    allButtons.push(btn);

    btn.onclick = async function () {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

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
      console.log("Chargement du son " + (index + 1) + " : " + url);

      decodedSound = await loadAndDecodeSound(url, ctx);

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

  // Lecture du son avec les trimbars
  playButton.onclick = async function () {
    if (!decodedSound) return;

    // 🔥 Réactiver le contexte audio avant lecture
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

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

  canvasOverlay.onmousedown = (evt) => {
    trimbarsDrawer.startDrag();
  };

  canvasOverlay.onmouseup = (evt) => {
    trimbarsDrawer.stopDrag();
  };

  // Boucle d’animation
  requestAnimationFrame(animate);
};

// Animation loop pour les trimbars
function animate() {
  trimbarsDrawer.clear();
  trimbarsDrawer.draw();
  requestAnimationFrame(animate);
}
