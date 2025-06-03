// /api/gpt-summary.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Summarize this news list into a 3-sentence smart digest in plain English.'
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const json = await openaiRes.json();

    if (!json.choices || !json.choices[0]?.message?.content) {
      throw new Error("Invalid GPT response");
    }

    res.status(200).json({ summary: json.choices[0].message.content });
  } catch (err) {
    console.error('GPT Summary Error:', err);
    res.status(500).json({ error: 'Failed to generate GPT summary' });
  }
}
