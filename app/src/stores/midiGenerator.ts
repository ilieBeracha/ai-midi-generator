import { create } from "zustand";
import { midiService } from "../services/midiService";

interface MidiGeneratorStore {
  generateMidi: (userPrompt: string, instrument: string) => Promise<void>;
  midiSettings: any;
}

export const midiGeneratorStore = create<MidiGeneratorStore>((set) => ({
  midiSettings: null,

  generateMidi: async (userPrompt: string, instrument: string) => {
    const midiSettings = await midiService.generateMidi(userPrompt, instrument);
    console.log(midiSettings);
    set({ midiSettings });
  },
}));
