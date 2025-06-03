const Parser = require('rss-parser');
const parser = new Parser();

const RSS_FEED = 'https://feeds.bbci.co.uk/news/world/rss.xml'; // single source

module.exports = async (req, res) => {
  try {
    const parsed = await parser.parseURL(RSS_FEED);
    const articles = parsed.items.slice(0, 5).map(item => ({
      title: item.title,
      url: item.link,
      description: item.contentSnippet || item.content || 'No summary.'
    }));

    res.status(200).json({ articles });
  } catch (err) {
    console.error('🛑 RSS Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch BBC World News.' });
  }
};
