export default class SamplerEngine {
  constructor(samples=[], callbacks={}) {
    this.samples = samples;        // URLs des sons
    this.names = [];               // noms des samples
    this.buffers = [];             // audio buffers décodés
    this.callbacks = callbacks;    // onStatus, onProgress, onPlay
  }

  // Mettre à jour les samples quand un preset est choisi
  updateSamples(urls, names) {
    this.samples = urls;
    this.names = names;
    this.buffers = new Array(urls.length).fill(null);
  }

  // Retourne un tableau de slots (pour GUI)
  getSlots() {
    return this.samples.map((url, i) => ({
      url,
      name: this.names[i] || `Sound ${i+1}`
    }));
  }

  // Charger tous les samples en parallèle
  async loadAllParallel() {
    const promises = this.samples.map((url, i) => this.loadSample(url, i));
    await Promise.all(promises);
  }

  async loadSample(url, index) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.buffers[index] = await audioCtx.decodeAudioData(arrayBuffer);

      this.callbacks.onStatus?.(index, {phase:"ready", message:"Prêt"});
      this.callbacks.onProgress?.(index, arrayBuffer.byteLength, arrayBuffer.byteLength);
    } catch (err) {
      console.error(err);
      this.callbacks.onStatus?.(index, {phase:"error", message: err.message});
    }
  }

  // Jouer un sample par index
  play(index) {
    if (!this.buffers[index]) return;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createBufferSource();
    source.buffer = this.buffers[index];
    source.connect(audioCtx.destination);
    source.start();
    this.callbacks.onPlay?.(index);
  }

  // Jouer tous les samples (exemple)
  playAll() {
    this.buffers.forEach((buf, i) => {
      if (buf) this.play(i);
    });
  }
}
