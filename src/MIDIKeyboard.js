import React, { useState } from "react";

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

function getWrap(xs, i) {
  return xs[i % xs.length];
}

function notesInKey(key) {
  const chromatic = Object.keys(notes);
  const rootI = chromatic.indexOf(key);
  return [rootI, 2, 4, 5, 7, 9, 11].map((i) => getWrap(chromatic, i));
}

function notesToFire(chords, key, rootName, octave) {
  const rootNumber = notes[rootName] + 12 * octave;
  if (!chords) {
    return [rootNumber];
  }
  const scale = notesInKey(key);
  const chordRootI = scale.indexOf(rootName);
  if (chordRootI < 0) {
    return [rootNumber];
  }
  const thirdNote = notes[getWrap(scale, chordRootI + 2)];
  const fifthNote = notes[getWrap(scale, chordRootI + 4)];
  const third = thirdNote + 12 * octave;
  const fifth = fifthNote + 12 * octave;
  const chord = [rootNumber, third, fifth];
  return chord;
}

function noteIsOn(noteNumbersOn, octave, noteName) {
  const noteNumber = notes[noteName] + 12 * octave;
  return noteNumbersOn.indexOf(noteNumber) >= 0;
}

export default function MIDIKeyboard({
  channel = 1,
  octave = 2,
  onEvent = () => {},
  chords = false,
  key = "C",
}) {
  const [notesOn, setNotesOn] = useState([]);
  function fireNoteOn(noteName, octave) {
    const notes = notesToFire(chords, key, noteName, octave);
    notes.map((noteNumber) => {
      onEvent({
        channel: 1,
        message: 0x9,
        description: "NoteOn",
        noteNumber,
        noteVelocity: 100,
      });
    });
    setNotesOn(notes);
  }
  function fireNoteOff(noteName, octave) {
    notesToFire(chords, key, noteName, octave).map((noteNumber) => {
      onEvent({
        channel: 1,
        message: 0x8,
        description: "NoteOff",
        noteNumber,
      });
    });
    setNotesOn([]);
  }

  const common = { octave, fireNoteOn, fireNoteOff };
  return (
    <div>
      <div style={styles.keyboard}>
        <Key {...common} noteName="C" on={noteIsOn(notesOn, octave, "C")} />
        <Key {...common} noteName="Db" on={noteIsOn(notesOn, octave, "Db")} />
        <Key {...common} noteName="D" on={noteIsOn(notesOn, octave, "D")} />
        <Key {...common} noteName="Eb" on={noteIsOn(notesOn, octave, "Eb")} />
        <Key {...common} noteName="E" on={noteIsOn(notesOn, octave, "E")} />
        <Key {...common} noteName="F" on={noteIsOn(notesOn, octave, "F")} />
        <Key {...common} noteName="Gb" on={noteIsOn(notesOn, octave, "Gb")} />
        <Key {...common} noteName="G" on={noteIsOn(notesOn, octave, "G")} />
        <Key {...common} noteName="Ab" on={noteIsOn(notesOn, octave, "Ab")} />
        <Key {...common} noteName="A" on={noteIsOn(notesOn, octave, "A")} />
        <Key {...common} noteName="Bb" on={noteIsOn(notesOn, octave, "Bb")} />
        <Key {...common} noteName="B" on={noteIsOn(notesOn, octave, "B")} />
        <Key
          {...common}
          noteName="C"
          octave={octave + 1}
          on={noteIsOn(notesOn, octave + 1, "C")}
        />
      </div>
    </div>
  );
}

function Key({ on = false, noteName, octave, fireNoteOn, fireNoteOff }) {
  const style = {
    ...styles.key,
    ...(noteName.length === 2 ? styles.keyBlack : {}),
    ...(on ? { backgroundColor: "green" } : {}),
  };

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
