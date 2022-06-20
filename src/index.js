import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import makeSynth from "./synth.js";
import MIDIKeyboard from "./MIDIKeyboard";

function App({ synth }) {
  return (
    <div>
      <h1>MIDI Synth</h1>
      <MIDIKeyboard
        onEvent={(ev) => {
          console.log(ev);
          synth.handleMIDI(ev);
        }}
      />
    </div>
  );
}

async function main() {
  const audioContext = new AudioContext();
  console.log({ audioContext });

  const synth = makeSynth(audioContext);
  const gain = new GainNode(audioContext, { gain: 0.5 });

  synth.connect(gain);
  gain.connect(audioContext.destination);

  const root = createRoot(document.getElementById("app"));
  root.render(<App synth={synth} />);
}

main();
