import cors from "cors";
import express from "express";
import { generateWithLlm } from "../src/lib/llmClient";
import type { JobApplicationRequest } from "../src/lib/schemas";

const app = express();
const port = Number(process.env.PORT ?? 8787);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/api/generate", async (req, res) => {
  const body = req.body as JobApplicationRequest;

  if (!body.resumeText?.trim() || !body.jobDescriptionText?.trim()) {
    res.status(400).json({ error: "Resume text and job description text are required." });
    return;
  }

  const result = await generateWithLlm(body);
  res.json(result);
});

app.listen(port, () => {
  console.log(`JobApply Agent local API listening on http://localhost:${port}`);
});
