// /api/gpt-summary.js
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { articles } = req.body;

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({ error: "Invalid articles array" });
    }

    const content = articles
      .slice(0, 5)
      .map((a, i) => `${i + 1}. ${a.title} – ${a.description || 'No summary'}`)
      .join("\n");

    const prompt = `You are Mirror Intel. Summarize the following news headlines into a short digest for today:\n\n${content}\n\nGPT Digest:`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.data.choices[0].message.content;
    res.status(200).json({ summary });

  } catch (error) {
    console.error("❌ GPT API Error:", error.message);
    res.status(500).json({ error: "GPT summarization failed" });
  }
}
