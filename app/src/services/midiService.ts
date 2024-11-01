import { axiosInstance } from "./requestService";

export const midiService = {
  generateMidi: async (userPrompt: string, instrument: string) => {
    const response = await axiosInstance.post("/ai-midi", {
      userPrompt,
      instrument,
    });
    return response.data;
  },
};
