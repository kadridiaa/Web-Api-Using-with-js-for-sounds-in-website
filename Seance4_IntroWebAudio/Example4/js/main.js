// js/main.js
import SamplerEngine from './SamplerEngine.js';
import SamplerGUI from './SamplerGui.js';

let ctx, engine, gui;
const baseURL = "http://localhost:3000";

window.onload = async function() {
    ctx = new AudioContext();
    engine = new SamplerEngine(ctx);

    const canvas = document.querySelector("#myCanvas");
    const canvasOverlay = document.querySelector("#myCanvasOverlay");
    const buttonsContainer = document.querySelector("#buttonsContainer");
    const playButton = document.querySelector("#playButton");
    const presetSelect = document.querySelector("#presetSelect");

    // Fetch presets
    let presets = [];
    try {
        const response = await fetch(`${baseURL}/api/presets`);
        presets = await response.json();
    } catch (err) { console.error(err); return; }

    presets.forEach((preset, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = preset.name;
        presetSelect.appendChild(option);
    });

    const loadPreset = async index => {
        const preset = presets[index];
        if (!preset) return;

        const urls = preset.samples.map(s => `${baseURL}/presets/${s.url.replace(/^\.\//,'')}`);
        await engine.loadSounds(urls);

        gui = new SamplerGUI(engine, canvas, canvasOverlay, buttonsContainer, playButton);
        await gui.createButtons();
    };

    if (presets.length > 0) await loadPreset(0);

    presetSelect.onchange = e => loadPreset(parseInt(e.target.value));
};
