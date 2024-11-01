import React, { useState } from "react";
import { Play, Pause, Download, Music2 } from "lucide-react";

export default function MidiGeneratedResults() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data - replace with your actual store data
  const midiSettings = {
    generatedMidi: {
      dataUri:
        "data:audio/midi;base64,TVRoZAAAAAYAAAABAIBNVHJrAAAASQD/AwtCYXNzIEdyb292ZQD/UQMJJ8AAwAAAkC1mhACALWYAkC1mhACALWYAkDBmhACAMGYAkDJmhACAMmYA/1gEBAIYCAD/LwA=",
    },
  };

  const handlePlay = () => {
    const audio = new Audio(midiSettings.generatedMidi.dataUri);
    if (!isPlaying) {
      audio.play().catch((error) => console.error("Playback failed:", error));
    } else {
      audio.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = midiSettings.generatedMidi.dataUri;
    link.download = "generated-music.midi";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-b from-blue-950/80 to-indigo-950/80 border border-blue-500/20 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Music2 className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-blue-100">Generated MIDI</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Play
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-100 font-medium transition-colors border border-blue-500/30"
          >
            <Download className="w-4 h-4" />
            Download MIDI
          </button>
        </div>
      </div>

      {/* Waveform Visualization (Mock) */}
      <div className="relative h-32 mb-6 rounded-lg bg-blue-950/50 border border-blue-500/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-1 h-full items-center">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-blue-400/50 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.sin(i * 0.2) * 50}%`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* MIDI Information */}
      <div className="space-y-2 text-blue-200/70 text-sm">
        <p className="flex items-center gap-2">
          <span className="font-medium text-blue-200">Format:</span> MIDI
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium text-blue-200">Size:</span>
          {Math.round(midiSettings.generatedMidi.dataUri.length * 0.75)} bytes
        </p>
      </div>
    </div>
  );
}
