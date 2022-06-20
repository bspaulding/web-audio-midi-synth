function midi2freq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export default function makeSynth(ctx) {
  let playing = false;
  const mixer = new GainNode(ctx, {
    gain: 1,
  });

  const oscs = [];

  return {
    connect(to) {
      mixer.connect(to);
    },
    start() {
      playing = true;
    },
    stop() {
      playing = false;
    },
    handleMIDI(event) {
      switch (event.message) {
        case 0x8: {
          // 0x8 is NoteOff
          if (oscs[event.noteNumber]) {
            oscs[event.noteNumber].stop();
            oscs[event.noteNumber].disconnect(mixer);
            oscs[event.noteNumber] = null;
          }
          break;
        }
        case 0x9: {
          // 0x9 is NoteOn

          // disconnect if exists, replay
          if (oscs[event.noteNumber]) {
            oscs[event.noteNumber].disconnect(mixer);
          }

          oscs[event.noteNumber] = new OscillatorNode(ctx, {
            type: "sine",
            frequency: midi2freq(event.noteNumber),
          });
          oscs[event.noteNumber].connect(mixer);
          oscs[event.noteNumber].start();
          break;
        }
      }
    },
  };
}
