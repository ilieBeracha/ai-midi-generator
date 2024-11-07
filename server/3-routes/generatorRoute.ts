import express from "express";
import { createMidiSettingsClaude } from "../2-logic/claudeLogic";

export const GeneratorRoute = express.Router();

GeneratorRoute.post("/", async (req, res) => {
  try {
    const userPrompt = req.body.userPrompt;
    const instrument = req.body.instrument;
    const generatedMidi = await createMidiSettingsClaude(
      userPrompt,
      instrument
    );
    res.json({ generatedMidi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
