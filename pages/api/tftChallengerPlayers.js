import axios from 'axios';

async function fetchChallengerPlayers(req, res) {
  const region = 'na1'; // Adjust as needed
  const url = `https://${region}.api.riotgames.com/tft/league/v1/challenger?queue=RANKED_TFT`;

  try {
    const response = await axios.get(url, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
    });
    // Process and send the IDs or full player data as needed
    // res.status(200).json(response.data.entries.map((entry) => entry.summonerId));
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Failed to fetch Challenger players:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
}

export default fetchChallengerPlayers;
