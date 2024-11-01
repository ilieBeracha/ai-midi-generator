import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { openAIRoute } from "./3-routes/openAIRoute";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ai-midi", openAIRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
