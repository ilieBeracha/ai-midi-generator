import { useState } from "react";
import { midiGeneratorStore } from "../stores/midiGenerator";
import { useStore } from "zustand";
import { Music, Wand2 } from "lucide-react";

export default function GenerateForm() {
  const [prompt, setPrompt] = useState("");
  const [instrument, setInstrument] = useState("piano");
  const [loading, setLoading] = useState(false);
  const useMidiGeneratorStore = useStore(midiGeneratorStore);

  const handleSubmit = async () => {
    setLoading(true);
    await useMidiGeneratorStore.generateMidi(prompt, instrument);
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-11">
        <Music className="w-14 h-14 text-indigo-400" />
        <h1 className="text-5xl font-extralight bg-gradient-to-r text-indigo-400 bg-clip-text text-transparent">
          Music Style Prompt
        </h1>
      </div>
      <div className="w-1/2 mx-auto p-8 rounded-2xl bg-gradient-to-b from-blue-950/80 to-indigo-950/80 border border-blue-500/20 shadow-gray-900 shadow-lg">
        {/* Header */}

        {/* Instrument Selection */}
        <div className="mb-6 space-y-2">
          <label
            htmlFor="instrument"
            className="block text-lg font-medium text-gray-300"
          >
            Select Instrument
          </label>
          <select
            id="instrument"
            className="w-full p-3 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500
                    transition-all duration-200 hover:border-gray-600"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          >
            {["Piano", "Guitar", "Violin", "Drums", "Bass", "Synthesizer"].map(
              (inst) => (
                <option key={inst.toLowerCase()} value={inst.toLowerCase()}>
                  {inst}
                </option>
              )
            )}
          </select>
        </div>

        {/* Prompt Input */}
        <div className="mb-6 space-y-2">
          <label className="block text-lg font-medium text-gray-300">
            Style Description
          </label>
          <textarea
            className="w-full h-[30vh] p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-gray-200
                     focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500
                     transition-all duration-200 hover:border-gray-600 resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your desired music style... (e.g., 'A melancholic piano piece with slow tempo and emotional depth')"
          />
        </div>

        {/* Generate Button */}
        {useMidiGeneratorStore.midiSettings == null && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group w-full p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 
                     hover:from-indigo-600 hover:to-purple-600 transition-all duration-300
                     text-white font-semibold text-lg shadow-lg hover:shadow-xl
                     disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              <Wand2
                className={`w-5 h-5 ${
                  loading
                    ? "animate-spin"
                    : "group-hover:rotate-12 transition-transform"
                }`}
              />
              {loading ? "Generating Magic..." : "Generate Music"}
            </div>
          </button>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-4 text-center text-gray-400 animate-pulse">
            Creating your musical masterpiece...
          </div>
        )}
      </div>
    </>
  );
}
