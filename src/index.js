import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import makeSynth from "./synth.js";
import MIDIKeyboard from "./MIDIKeyboard";

function App({ initAudio, synth }) {
  const [initialized, setInitialized] = useState(false);
  const [octave, setOctave] = useState(2);
  const [chords, setChords] = useState(false);

  return (
    <div>
      <h1>MIDI Synth</h1>
      {!initialized ? (
        <button
          onClick={() => {
            setInitialized(true);
            synth.start();
          }}
        >
          On
        </button>
      ) : (
        <button
          onClick={() => {
            setInitialized(false);
            synth.stop();
          }}
        >
          Off
        </button>
      )}
      {initialized && (
        <>
          <label htmlFor="octave">
            Octave:{" "}
            <input
              type="range"
              min="-2"
              max="8"
              name="octave"
              value={octave}
              onInput={(ev) => setOctave(parseInt(ev.target.value, 10))}
            />
          </label>
          <label htmlFor="chords">
            Chords?{" "}
            <input
              type="checkbox"
              name="chords"
              value={chords}
              onChange={(ev) => setChords(ev.target.checked)}
            />
          </label>
          <MIDIKeyboard
            chords={chords}
            octave={octave}
            onEvent={synth.handleMIDI}
          />
        </>
      )}
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
