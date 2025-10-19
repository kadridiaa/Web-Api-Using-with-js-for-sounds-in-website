// "named" imports from utils.js and soundutils.js
import { loadAndDecodeSound, playSound } from './soundutils.js';

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

let decodedSounds = [];
let selectedSoundIndex = null; // Aucun son sélectionné au départ

window.onload = async function init() {
  ctx = new AudioContext();

  const playButton = document.querySelector("#playButton");
  playButton.disabled = true;

  const container = document.createElement("div");
  container.style.marginTop = "10px";
  document.body.appendChild(container);

  // Chargement et décodage de tous les sons
  console.log("Chargement des sons...");
  decodedSounds = await Promise.all(
    soundURLs.map(url => loadAndDecodeSound(url, ctx))
  );
  console.log("Tous les sons sont décodés ✅");

  // Création des boutons pour chaque son
  soundURLs.forEach((url, index) => {
    const btn = document.createElement("button");
    btn.textContent = `Sound ${index + 1}`;
    btn.style.margin = "5px";
    btn.onclick = function () {
      selectedSoundIndex = index;
      console.log(`Son ${index + 1} sélectionné`);

      // Changer le style visuel du bouton actif
      document.querySelectorAll(".soundButton").forEach(b => {
        b.style.backgroundColor = "";
      });
      btn.style.backgroundColor = "lightgreen";
    };
    btn.classList.add("soundButton");
    container.appendChild(btn);
  });

  // Quand tout est chargé, on active le bouton Play
  playButton.disabled = false;

  // Gestion du bouton Play
  playButton.onclick = async function () {
    if (selectedSoundIndex === null) {
      alert("Veuillez d'abord sélectionner un son !");
      return;
    }

    // Certains navigateurs nécessitent de réactiver le contexte audio
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const sound = decodedSounds[selectedSoundIndex];
    playSound(ctx, sound, 0, sound.duration);
    console.log(`Lecture du son ${selectedSoundIndex + 1}`);
  };
};
