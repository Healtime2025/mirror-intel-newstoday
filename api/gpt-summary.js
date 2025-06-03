export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { articles } = req.body;

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({ error: 'Invalid articles array' });
    }

    // Simulated GPT-style summarization (replace this with real API later)
    const summary = articles
      .slice(0, 3)
      .map((a, i) => `${i + 1}. ${a.title} – ${a.description || 'No summary'}`)
      .join('\n');

    res.status(200).json({ summary });
  } catch (error) {
    console.error('❌ GPT Summary Error:', error.message);
    res.status(500).json({ error: 'GPT summarization failed' });
  }
}
