import MidiWriter from "midi-writer-js";
import fs from "fs";
import { MidiSettings } from "../types/midi";
import { Track } from "midi-writer-js/build/types/chunks/track";

export function generateMidi(midiSettings: MidiSettings, instrument: string) {
  console.log("midiSettings in midiLogic", midiSettings);
  let track = new MidiWriter.Track();

  track = addTrackName(track, midiSettings);
  track = setTempo(track, midiSettings);
  track = addInstrument(track, midiSettings);
  track = addNotesEvent(track, midiSettings);
  track = setTimeSignature(track, midiSettings);

  const write = new MidiWriter.Writer(track);
  const midiData = write.buildFile();

  saveFile(midiData, midiSettings.trackName);

  return {
    file: midiData,
    dataUri: write.dataUri(),
    trackName: midiSettings.trackName,
    instrument: instrument,
  };
}

function saveFile(midiData: Uint8Array, trackName: string) {
  fs.writeFileSync(
    `${process.env.OUTPUT_PATH}/${trackName}.mid`,
    Buffer.from(midiData)
  );
}

function addNotesEvent(track: Track, midiSettings: MidiSettings) {
  midiSettings.notes.forEach((note) => {
    const noteEvent = new MidiWriter.NoteEvent({
      pitch: note.pitch,
      duration: note.duration,
      wait: note.wait,
      sequential: note.sequential,
      velocity: note.velocity,
      repeat: note.repeat,
      channel: note.channel,
      grace: note.grace,
      tick: note.tick,
    });
    track.addEvent(noteEvent);
  });

  return track;
}

function setTimeSignature(track: Track, midiSettings: MidiSettings) {
  if (midiSettings.timeSignature) {
    track.setTimeSignature(
      midiSettings.timeSignature.numerator,
      midiSettings.timeSignature.denominator,
      24,
      8
    );
  }

  return track;
}

function addInstrument(track: Track, midiSettings: MidiSettings) {
  track.addEvent(
    new MidiWriter.ProgramChangeEvent({ instrument: midiSettings.instrument })
  );

  return track;
}

function addTrackName(track: Track, midiSettings: MidiSettings) {
  track.addTrackName(midiSettings.trackName);
  return track;
}

function setTempo(track: Track, midiSettings: MidiSettings) {
  track.setTempo(midiSettings.tempo);

  return track;
}
