function midi2freq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export default function makeSynth(ctx) {
  let attackTimeS = 0.2;
  let releaseTimeS = 1.0;
  const mixer = new GainNode(ctx, { gain: 1 });

  const oscs = [];
  const gains = [];
  let releasingOscs = [];

  function initOsc(noteNumber) {
    oscs[noteNumber] = new OscillatorNode(ctx, {
      type: "sine",
      frequency: midi2freq(noteNumber),
    });
    gains[noteNumber] = new GainNode(ctx, { gain: 0 });
    oscs[noteNumber].connect(gains[noteNumber]);
    gains[noteNumber].connect(mixer);
    oscs[noteNumber].start();
  }

  function cleanupOsc(noteNumber) {
    if (oscs[noteNumber]) {
      oscs[noteNumber].stop();
      oscs[noteNumber].disconnect();
      gains[noteNumber].disconnect();
      oscs[noteNumber] = null;
      gains[noteNumber] = null;
    }
  }

  function cleanupOscs() {
    releasingOscs = releasingOscs.filter(([releasedTime, osc, gain]) => {
      const isReleased = ctx.currentTime > releasedTime;
      if (isReleased) {
        osc.disconnect();
        gain.disconnect();
      }
      return !isReleased;
    });
  }

  return {
    connect(to) {
      mixer.connect(to);
    },
    start() {},
    stop() {
      mixer.disconnect();
      for (var i = 0; i < 128; i += 1) {
        cleanupOsc(i);
      }
    },
    handleMIDI(event) {
      console.log(`synth handleMIDI: `, event);
      switch (event.message) {
        case 0x8: {
          // 0x8 is NoteOff
          if (!oscs[event.noteNumber]) {
            // ignore note off when no note on
            return;
          }
          const releasedTime = ctx.currentTime + releaseTimeS;
          gains[event.noteNumber].gain.linearRampToValueAtTime(0, releasedTime);
          releasingOscs.push([
            releasedTime,
            oscs[event.noteNumber],
            gains[event.noteNumber],
          ]);
          oscs[event.noteNumber] = null;
          gains[event.noteNumber] = null;

          cleanupOscs();
          break;
        }
        case 0x9: {
          // 0x9 is NoteOn
          if (!oscs[event.noteNumber]) {
            initOsc(event.noteNumber);
            gains[event.noteNumber].gain.linearRampToValueAtTime(
              event.noteVelocity / 127,
              ctx.currentTime + attackTimeS
            );
          }

          cleanupOscs();
          break;
        }
      }
    },
  };
}
