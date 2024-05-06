// pages/api/testRiotApi.js
import axios from 'axios';

export default async function handler(req, res) {
  const apiKey = process.env.RIOT_API_KEY;
  const summonerId = req.query.summonerId;
  const region = 'na1'; // Change this based on your region
  // const url = `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/${summonerId}`;
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/k3soju1/NA1`;
  // const url = `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/pGttksXjnh0b3UYxQZQfcBEMp6ogHipwNgnDEH5z9vohRd8GOSnxU-cq-E7LCK3toSanj6xaEbUMZA`;
  // const url = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/pGttksXjnh0b3UYxQZQfcBEMp6ogHipwNgnDEH5z9vohRd8GOSnxU-cq-E7LCK3toSanj6xaEbUMZA/ids`;
  // const url = `https://americas.api.riotgames.com/tft/match/v1/matches/NA1_4989574402`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-Riot-Token': apiKey,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to fetch data from Riot API' });
  }
}
