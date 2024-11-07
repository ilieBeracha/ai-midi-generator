import { useStore } from "zustand";
import { midiGeneratorStore } from "../stores/midiGenerator";
import GenerateForm from "../components/MidiGenerateForm";
import MidiGeneratedResults from "../components/MidiGeneratedResults";

export default function Generate() {
  const useMidiGeneratorStore = useStore(midiGeneratorStore);
  const midiSettings = useMidiGeneratorStore.midiSettings;
  return (
    <div className="view flex flex-col items-center justify-center">
      {midiSettings ? (
        <MidiGeneratedResults midiSettings={midiSettings} />
      ) : (
        <>
          <GenerateForm />
        </>
      )}
    </div>
  );
}
