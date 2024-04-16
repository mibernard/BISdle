console.log('temp1');
const fetchImageAlts = require('../scraper');
console.log('temp2');

module.exports = async (req, res) => {
  console.log('function called');
  const unit = req.query.unit; // Vercel uses `query` for URL parameters
  const url = `https://www.metatft.com/units/${unit}`;
  console.log('url: ', url);
  try {
    const alts = await fetchImageAlts(url);
    res.status(200).json({ success: true, alts: alts });
  } catch (error) {
    console.error('Error during scraping:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};
