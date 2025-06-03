// /api/fetch-news.js
const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
  const feedURL = 'https://feeds.bbci.co.uk/news/world/rss.xml';

  try {
    const parsed = await parser.parseURL(feedURL);
    const articles = parsed.items.slice(0, 5).map(item => ({
      title: item.title,
      url: item.link,
      description: item.contentSnippet || item.content || 'No summary.'
    }));

    res.status(200).json({ articles });
  } catch (err) {
    console.error('❌ Mirror Intel RSS error:', err.message);
    res.status(500).json({ error: 'Failed to fetch or parse RSS feed' });
  }
};
