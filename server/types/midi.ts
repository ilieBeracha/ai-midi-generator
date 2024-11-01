export interface MidiNote {
  pitch: string | string[]; // Note name(s) (e.g., 'C4' or ['C4', 'E4', 'G4'])
  duration: string | string[]; // Duration(s) (e.g., '4' for quarter note)
  wait?: string | string[]; // Wait time before the note (optional)
  sequential?: boolean; // Play notes sequentially if multiple pitches are provided
  velocity?: number; // Volume (1-100)
  repeat?: number; // Number of times to repeat the note
  channel?: number; // MIDI channel (1-16)
  grace?: string | string[]; // Grace note(s) (optional)
  tick?: number; // Specific tick for the note (optional)
}

export interface MidiSettings {
  instrument: number; // MIDI instrument number (1-128)
  tempo: number; // Tempo in beats per minute
  timeSignature?: {
    numerator: number;
    denominator: number;
  }; // Time signature (optional)
  notes: MidiNote[]; // Array of MidiNote objects
  trackName: string; // Name of the track (optional)
  copyright?: string; // Copyright information (optional)
  lyrics?: string[]; // Array of lyrics corresponding to notes (optional)
}
