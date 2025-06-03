// /api/fetch-news.js
const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
  try {
    const feed = await parser.parseURL('https://feeds.bbci.co.uk/news/world/rss.xml');
    const articles = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      url: item.link,
      description: item.contentSnippet || item.content || 'No summary.'
    }));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ articles });
  } catch (err) {
    console.error("🛑 RSS Fetch Error:", err.message);
    res.status(500).json({ error: "A server error occurred." });
  }
};
