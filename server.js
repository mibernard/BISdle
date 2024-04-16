const express = require('express');
const fetchImageAlts = require('./scraper');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/fetch-alts/:unit', async (req, res) => {
  const unit = req.params.unit;
  const url = `https://www.metatft.com/units/${unit}`;
  try {
    const alts = await fetchImageAlts(url);
    res.json({ success: true, alts });
  } catch (error) {
    console.error('Error during scraping:', error.message); // Make sure to log the error message
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
