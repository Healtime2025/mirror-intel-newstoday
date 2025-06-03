// /api/gpt-digest.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req, res) => {
  try {
    const { articles } = req.body;

    if (!articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: 'Invalid articles format' });
    }

    const content = articles
      .map((a, i) => `${i + 1}. ${a.title} – ${a.description}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful summarizer that writes news digests.' },
        { role: 'user', content: `Summarize the following news in 2 paragraphs:\n\n${content}` }
      ],
    });

    const digest = response.choices[0].message.content;
    res.status(200).json({ digest });
  } catch (err) {
    console.error('GPT Digest Error:', err.message);
    res.status(500).json({ error: 'Failed to generate digest.' });
  }
};
