// /api/fetch-news.js
const Parser = require('rss-parser');
const parser = new Parser();

// Supported news sources
const sources = {
  bbc: 'https://feeds.bbci.co.uk/news/world/rss.xml',
  cnn: 'http://rss.cnn.com/rss/edition_world.rss',
  reuters: 'http://feeds.reuters.com/Reuters/worldNews',
  aljazeera: 'https://www.aljazeera.com/xml/rss/all.xml'
};

module.exports = async (req, res) => {
  const { source } = req.query;
  const feedUrl = sources[source] || sources.bbc;

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
