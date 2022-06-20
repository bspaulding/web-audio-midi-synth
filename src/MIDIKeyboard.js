import React from "react";

const styles = {
  keyboard: {
    display: "flex",
  },
  key: {
    height: 400,
    width: 50,
    border: "1px solid black",
  },
  keyBlack: {
    backgroundColor: "black",
    color: "white",
    height: 250,
  },
};

// midi note numbers for octave 0
const notes = {
  C: 24,
  Db: 25,
  D: 26,
  Eb: 27,
  E: 28,
  F: 29,
  Gb: 30,
  G: 31,
  Ab: 32,
  A: 33,
  Bb: 34,
  B: 35,
};

export default function MIDIKeyboard({ channel = 1, onEvent }) {
  const octave = 1;
  const zeroCNoteNumber = 24;

  function fireNoteOn(noteName, octave) {
    onEvent({
      channel: 1,
      message: 0x9,
      description: "NoteOn",
      noteNumber: notes[noteName] + 12 * octave,
      noteVelocity: 100,
    });
  }
  function fireNoteOff(noteName, octave) {
    onEvent({
      channel: 1,
      message: 0x8,
      description: "NoteOff",
      noteNumber: notes[noteName] + 12 * octave,
    });
  }

  const common = { octave, fireNoteOn, fireNoteOff };
  return (
    <div style={styles.keyboard}>
      <Key {...common} noteName="C" />
      <Key {...common} noteName="Db" />
      <Key {...common} noteName="D" />
      <Key {...common} noteName="Eb" />
      <Key {...common} noteName="E" />
      <Key {...common} noteName="F" />
      <Key {...common} noteName="Gb" />
      <Key {...common} noteName="G" />
      <Key {...common} noteName="Ab" />
      <Key {...common} noteName="A" />
      <Key {...common} noteName="Bb" />
      <Key {...common} noteName="B" />
      <Key {...common} noteName="C" octave={octave + 1} />
    </div>
  );
}

function Key({ noteName, octave, fireNoteOn, fireNoteOff }) {
  const style =
    noteName.length === 2 ? { ...styles.key, ...styles.keyBlack } : styles.key;

  return (
    <div
      style={style}
      onMouseDown={() => fireNoteOn(noteName, octave)}
      onMouseUp={() => fireNoteOff(noteName, octave)}
    >
      {noteName}
    </div>
  );
}
