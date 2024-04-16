const fetchImageAlts = require('../scraper');

module.exports = async (req, res) => {
  console.log('inside fetch-alts');

  const unit = req.query.unit; // Vercel uses `query` for URL parameters
  const url = `https://www.metatft.com/units/${unit}`;
  console.log('url: ', url);
  try {
    const alts = await fetchImageAlts(url);
    console.log('fetchImageAlts');
    res.status(200).json({ success: true, alts: alts });
  } catch (error) {
    console.error('Error during scraping:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};
