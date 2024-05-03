// const fetchImageAlts = require('./scraper');

// module.exports = async (req, res) => {
//   console.log('inside fetch-alts');

//   const unit = req.query.unit.toLowerCase(); // Vercel uses `query` for URL parameters
//   // const url = `https://www.metatft.com/units/${unit}`;
//   const url = `https://mobalytics.gg/tft/champions/${unit}`;

//   console.log('url: ', url);
//   try {
//     const alts = await fetchImageAlts(url);
//     console.log('fetchImageAlts');
//     res.status(200).json({ success: true, alts: alts });
//   } catch (error) {
//     console.error('Error during scraping:', error.message);
//     res.status(500).json({ success: false, message: 'Failed to fetch data' });
//   }
// };

// pages/api/fetch-champion-items.js
import axios from 'axios';

export default async function handler(req, res) {
  const { unit } = req.query; // 'unit' would be the champion's name

  const API_KEY = process.env.RIOT_API_KEY; // Your Riot API key
  const baseURL = 'https://api.riotgames.com/tft/champions';
  try {
    const response = await axios.get(`${baseURL}/${encodeURIComponent(unit)}`, {
      headers: {
        'X-Riot-Token': API_KEY,
      },
    });
    // Assuming the API provides the item combinations directly, or you might need additional processing
    const items = response.data; // This might need adjustment based on the actual API response structure

    // Here, you might need to add logic to find the combination with the highest win rate
    const highestWinRateCombo = findHighestWinRateCombo(items);

    res.status(200).json({ success: true, items: highestWinRateCombo });
  } catch (error) {
    console.error('Failed to fetch data from TFT API:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
}

function findHighestWinRateCombo(items) {
  // This is a placeholder function. You'll need to implement this based on how the data is structured.
  // For example:
  return items.reduce((highest, item) => (item.winRate > highest.winRate ? item : highest), items[0]);
}
