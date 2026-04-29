import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/humanize", async (req, res) => {
  const text = req.body.text;

  const prompt = `
Rewrite this text to sound fully natural, human, and fluent.
Keep meaning exactly the same:

${text}
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GOOGLE_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();

  const output =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Error generating response";

  res.json({ result: output });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
