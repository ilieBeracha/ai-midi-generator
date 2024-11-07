import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Music2 } from "lucide-react";
import { Midi } from "@tonejs/midi";
import { Soundfont, SplendidGrandPiano, DrumMachine } from "smplr";

export default function MidiGeneratedResults({
  midiSettings,
}: {
  midiSettings: any;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioContext = useRef<AudioContext | null>(null);
  const instrument = useRef<any>(null);

  useEffect(() => {
    // Initialize audio context
    audioContext.current = new AudioContext();
    const instrumentType = midiSettings.generatedMidi.instrument;

    // Create appropriate instrument based on type
    switch (instrumentType) {
      case "Piano":
        instrument.current = new SplendidGrandPiano(audioContext.current);
        break;
      case "Drums":
        instrument.current = new DrumMachine(audioContext.current);
        break;
      default:
        // Use Soundfont for other instruments
        instrument.current = new Soundfont(audioContext.current, {
          instrument: instrumentType.toLowerCase(),
        });
    }

    // Wait for instrument to load
    instrument.current.load.then(() => {
      setIsLoading(false);
      console.log(`${instrumentType} loaded`);
    });

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [midiSettings.generatedMidi.instrument]);

  const handlePlay = async () => {
    if (!instrument.current || isLoading) return;

    try {
      if (!isPlaying) {
        await audioContext.current?.resume();

        const base64Data = midiSettings.generatedMidi.dataUri.split(",")[1];
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const midi = new Midi(bytes);
        const now = audioContext.current?.currentTime || 0;

        midi.tracks[0].notes.forEach((note) => {
          instrument.current.start({
            note: note.name,
            velocity: note.velocity,
            time: now + note.time,
            duration: note.duration,
          });
        });
      } else {
        instrument.current.stop();
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Playback failed:", error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = midiSettings.generatedMidi.dataUri;
    link.download = midiSettings.generatedMidi.trackName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-1/4 mx-auto p-6 rounded-2xl bg-gradient-to-b from-blue-950/80 to-indigo-950/80 border border-blue-500/20 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Music2 className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-blue-100">Generated MIDI</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg 
              ${
                isLoading
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } 
              text-white font-medium transition-colors`}
          >
            {isLoading ? (
              "Loading..."
            ) : isPlaying ? (
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
