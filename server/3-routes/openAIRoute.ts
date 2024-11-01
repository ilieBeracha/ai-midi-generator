import express from "express";
import { createMidiSettings } from "../2-logic/openAILogic";

export const openAIRoute = express.Router();

openAIRoute.post("/", async (req, res) => {
  try {
    const userPrompt = req.body.userPrompt;
    const instrument = req.body.instrument;
    const generatedMidi = await createMidiSettings(userPrompt, instrument);
    res.json({ generatedMidi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
