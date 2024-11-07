import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GeneratorRoute } from "./3-routes/generatorRoute";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ai-midi", GeneratorRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
