export default class SamplerGUI {
  constructor(engine, container) {
    this.engine = engine;
    this.container = container;
    this.slotEls = [];
    this.createButtons();
  }

  createButtons() {
    const slots = this.engine.getSlots();
    this.container.innerHTML = "";
    this.slotEls = [];

    slots.forEach((slot, i) => {
      const pad = document.createElement("button");
      pad.className = "soundButton";
      pad.textContent = slot.name;
      pad.style.margin = "5px";
      pad.style.padding = "15px 25px";
      pad.style.fontSize = "18px";
      pad.style.borderRadius = "15px";
      pad.style.border = "none";
      pad.style.backgroundColor = "#1f2937";
      pad.style.color = "#fff";
      pad.style.cursor = "pointer";
      pad.style.boxShadow = "0 6px #999";
      
      pad.onmousedown = () => {
        pad.style.transform = "translateY(4px)";
        pad.style.boxShadow = "0 3px #666";
      };
      pad.onmouseup = () => {
        pad.style.transform = "";
        pad.style.boxShadow = "0 6px #999";
      };

      pad.onclick = () => {
        this.engine.play(i);
        // highlight selected pad
        this.slotEls.forEach(b => {
          b.style.backgroundColor = "#1f2937";
          b.style.color = "#fff";
        });
        pad.style.backgroundColor = "#3b82f6"; // bleu hover
        pad.style.color = "#fff";
      };

      this.container.appendChild(pad);
      this.slotEls.push(pad);
    });
  }

  updateStatus(index, phase, message) {
    // ici tu peux mettre un petit label ou console.log
    console.log(`Pad ${index}: ${phase} - ${message}`);
  }

  updateProgress(index, recvd, total) {
    console.log(`Pad ${index} progress: ${recvd}/${total}`);
  }

  playPadAnimation(index) {
    const pad = this.slotEls[index];
    if (!pad) return;
    pad.style.transform = "scale(0.95)";
    setTimeout(()=>pad.style.transform="", 150);
  }
}
