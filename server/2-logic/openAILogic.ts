import { openai } from "../1-dal/openAi";
import { generateMidi } from "./midiLogic";

export async function createMidiSettings(
  userPrompt: string,
  instrument: string
) {
  // Stringify the userIdea object for ChatGPT prompt

  const { midiSettings } = await generateUserMidi(userPrompt, instrument);
  console.log("midiSettings", midiSettings);

  const generatedMidi = generateMidi(midiSettings);
  return generatedMidi;
}

export async function generateUserMidi(userIdea: string, instrument: string) {
  const systemMessage = {
    role: "system" as const,
    content: openAISystemMessage,
  };

  const userMessage = {
    role: "user" as const,
    content: `
      I want a MIDI track based on the following idea:

      ${userIdea}

      The instrument should be ${instrument}.

      Please create a JSON configuration for a MIDI track following these specifications.
    `,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4-0613",
    messages: [systemMessage, userMessage],
    functions: [generatedMidiFunction],
    function_call: { name: "generate_midi" },
  });

  if (
    response.choices &&
    response.choices.length > 0 &&
    response.choices[0].message?.function_call?.arguments
  ) {
    const midiSettings = JSON.parse(
      response.choices[0].message.function_call.arguments
    );
    return midiSettings;
  }
}

const generatedMidiFunction = {
  name: "generate_midi",
  description: "Generates a JSON configuration for a user-defined MIDI idea",
  parameters: {
    type: "object",
    properties: {
      midiSettings: {
        type: "object",
        properties: {
          instrument: {
            type: "string",
            description: "Selected instrument",
          },
          tempo: { type: "integer", description: "Tempo in BPM" },
          timeSignature: {
            type: "object",
            properties: {
              numerator: { type: "integer" },
              denominator: { type: "integer" },
            },
            required: ["numerator", "denominator"],
          },
          notes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                pitch: { type: "array", items: { type: "string" } },
                duration: { type: "string" },
                velocity: { type: "integer" },
                repeat: { type: "integer" },
              },
              required: ["pitch", "duration", "velocity", "repeat"],
            },
            minItems: 1,
          },
          trackName: {
            type: "string",
            description: "Track name with underscores instead of spaces",
          },
          copyright: { type: "string" },
          lyrics: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "instrument",
          "tempo",
          "timeSignature",
          "notes",
          "trackName",
        ],
      },
    },
    required: ["midiSettings"],
  },
};

const openAISystemMessage = `
You are an expert MIDI composer. Your task is to generate JSON settings for a music track based on the given user idea. Adhere to JSON formatting, maintain musical style alignment, and provide a clear structure. Follow these strict guidelines:

1. **Ensure Monophonic Bassline**:
   - Only one note is played at any given time with no overlaps.
   - Each new note should start only after the previous note has ended.

2. **Style-Specific Characteristics**:
   - The track should reflect the genre, overall characteristics, and instrument layers as described by the user.
   - Each element (e.g., drums, bass, chords) should align with their specified patterns, dynamics, and tempo.

3. **JSON Output Structure**:
   - Ensure fields like "instrument," "tempo," "timeSignature," "notes," "trackName" are clearly defined.
   - Include rhythmic and structural dynamics as specified in the user’s preferences for genre and instrument layers.

4. **Groove and Feel**:
   - Implement rhythmic and syncopated grooves suitable for the style, with slight variation to avoid a robotic feel.
   - Avoid long notes in favor of short, punchy notes where appropriate, ensuring a danceable rhythm.

The generated JSON should reflect the user’s musical preferences precisely. Make sure to adhere to the structure required for creating a MIDI configuration.
`;
