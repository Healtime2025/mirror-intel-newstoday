// /api/fetch-news.js
const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
  const feedUrl = 'https://feeds.bbci.co.uk/news/world/rss.xml';

  try {
    const parsed = await parser.parseURL(feedUrl);

    const trimmed = parsed.items.slice(0, 5).map(item => ({
      title: item.title || "Untitled",
      url: item.link,
      description: item.contentSnippet || item.content || "No summary."
    }));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ articles: trimmed });

  } catch (err) {
    console.error("❌ Feed Error:", err.message);
    res.status(500).json({ error: "A server error occurred while fetching the news." });
  }
};
