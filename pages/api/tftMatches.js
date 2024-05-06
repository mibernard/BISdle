// import axios from 'axios';

// async function fetchMatches(req, res) {
//   const { puuid } = req.query; //{} are used for destructuring, basically takes puuid property value from the req.query
//   const region = 'americas'; // Match history might be stored differently
//   const url = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids`;
//   //dishsoaps puuid = oK8ZzbXf2vNt3NThnpjB0ISlFca-RseO3J1REaPijty8Skl88MLKw3rBY0ZfDcLw49-3q1WCY8zVrA
//   //k3soju1 puuid = NWTnvxwpLQ3XuTbiOOI29lO8LrQ4cumVYAHuu05UJ3460QMXV9RXWRb3112m93pPWmTLri5LlDjLQA

//   try {
//     const response = await axios.get(url, {
//       headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
//       params: { count: 10 }, // Fetch up to 10 matches as an example
//     });
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Failed to fetch matches:', error);
//     res.status(500).json({ message: 'Failed to fetch data' });
//   }
// }

// export default fetchMatches;

import axios from 'axios';

async function fetchMatches(playerPUUID) {
  const region = 'AMERICAS'; // Ensure you use the correct region endpoint
  const matchesUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/NWTnvxwpLQ3XuTbiOOI29lO8LrQ4cumVYAHuu05UJ3460QMXV9RXWRb3112m93pPWmTLri5LlDjLQA/ids?count=20`; //gets dishsoaps 10 recent matches
  // const matchesUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${playerPUUID}/ids?count=10`;
  const apiKey = process.env.RIOT_API_KEY;
  const matchIds = await axios.get(matchesUrl, { headers: { 'X-Riot-Token': apiKey } }).then((res) => res.data);

  let championItems = {};

  for (let matchId of matchIds) {
    const matchDetailsUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/${matchId}`;
    const matchDetails = await axios
      .get(matchDetailsUrl, { headers: { 'X-Riot-Token': apiKey } })
      .then((res) => res.data);

    // Process each match's details to aggregate item data
    matchDetails.info.participants.forEach((participant) => {
      participant.units.forEach((unit) => {
        const championName = unit.character_id;
        const items = unit.itemNames; // Accessing the correct items array

        if (!championItems[championName]) {
          championItems[championName] = {};
        }

        items.forEach((item) => {
          if (!championItems[championName][item]) {
            championItems[championName][item] = 0;
          }
          championItems[championName][item]++;
        });
      });
    });
  }

  return championItems; // This contains the item frequency for each champion
}

export default async function handler(req, res) {
  const { puuid } = req.query; // Assume you pass the player's PUUID as a query parameter
  try {
    const itemData = await fetchMatches(puuid);
    res.status(200).json({ success: true, data: itemData });
  } catch (error) {
    console.error('Failed to fetch match data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
}
