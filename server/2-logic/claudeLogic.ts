import Anthropic from "@anthropic-ai/sdk";
import { generateMidi } from "./midiLogic";
import dotenv from "dotenv";
import { MidiSettings } from "../types/midi";

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function createMidiSettingsClaude(
  userPrompt: string,
  instrument: string
) {
  const midiSettings = await generateUserMidiClaude(userPrompt, instrument);
  const generatedMidi = generateMidi(midiSettings, instrument);
  return generatedMidi;
}

export async function generateUserMidiClaude(
  userIdea: string,
  instrument: string
) {
  const fullPrompt = `You are a MIDI music generator. Convert the user's musical idea into detailed MIDI settings. 
        Use the provided instrument (${instrument}) and create appropriate tempo, notes, and other settings.
        
        User's idea: ${userIdea}`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    messages: [{ role: "user", content: fullPrompt }],
    max_tokens: 1000,
    tools: [midiTool],
    tool_choice: { type: "auto" },
  });

  const toolUseContent = response.content.find(
    (content) => content.type === "tool_use"
  );

  if (!toolUseContent) {
    throw new Error("No MIDI data generated");
  }

  const midiData = (toolUseContent as { input: MidiSettings }).input;

  return midiData;
}

const midiTool = {
  name: "generate_midi_data",
  description: "Generate MIDI track data with detailed note and track settings",
  input_schema: {
    type: "object" as const,
    properties: {
      instrument: {
        type: "integer",
        description: "MIDI instrument number (1-128)",
        minimum: 1,
        maximum: 128,
      },
      tempo: {
        type: "integer",
        description: "Tempo in beats per minute",
        minimum: 20,
        maximum: 400,
      },
      trackName: {
        type: "string",
        description: "Name of the MIDI track",
      },
      timeSignature: {
        type: "object",
        properties: {
          numerator: {
            type: "integer",
            description: "Number of beats per measure",
            minimum: 1,
          },
          denominator: {
            type: "integer",
            description: "Note value that represents one beat",
            enum: [2, 4, 8, 16],
          },
        },
        required: ["numerator", "denominator"],
      },
      notes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            pitch: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } },
              ],
            },
            duration: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } },
              ],
            },
            wait: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } },
              ],
            },
            sequential: { type: "boolean" },
            velocity: {
              type: "integer",
              minimum: 1,
              maximum: 100,
            },
            repeat: {
              type: "integer",
              minimum: 1,
            },
            channel: {
              type: "integer",
              minimum: 1,
              maximum: 16,
            },
            grace: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } },
              ],
            },
            tick: { type: "integer" },
          },
          required: ["pitch", "duration"],
        },
      },
    },
    required: ["instrument", "tempo", "trackName", "notes"],
  },
};
