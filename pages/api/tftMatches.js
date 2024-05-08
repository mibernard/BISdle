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

let cacheInitialized = false; // Flag to check cache status
const cacheRefreshInterval = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

async function fetchMatches() {
  const region = 'AMERICAS';
  const matchesUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/NWTnvxwpLQ3XuTbiOOI29lO8LrQ4cumVYAHuu05UJ3460QMXV9RXWRb3112m93pPWmTLri5LlDjLQA/ids?count=10`;
  const apiKey = process.env.RIOT_API_KEY;
  const matchIds = await axios.get(matchesUrl, { headers: { 'X-Riot-Token': apiKey } }).then((res) => res.data);

  let championItems = {};

  for (let matchId of matchIds) {
    const matchDetailsUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/${matchId}`;
    const matchDetails = await axios
      .get(matchDetailsUrl, { headers: { 'X-Riot-Token': apiKey } })
      .then((res) => res.data);

    matchDetails.info.participants.forEach((participant) => {
      participant.units.forEach((unit) => {
        const championName = unit.character_id;
        const items = unit.itemNames;

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

  // Filter out champions with no items
  Object.keys(championItems).forEach((champion) => {
    if (Object.keys(championItems[champion]).length < 3) {
      delete championItems[champion];
    }
  });

  return championItems;
}

function initializeCache() {
  console.log('Starting cache initialization...');
  fetchMatches()
    .then(() => {
      console.log('Cache has been initialized.');
      cacheInitialized = true;
      setTimeout(initializeCache, cacheRefreshInterval); // Schedule next refresh
    })
    .catch((error) => console.error('Failed to initialize cache:', error));
}

export default async function handler(req, res) {
  if (!cacheInitialized) {
    initializeCache(); // Initialize on first API access if not already done
  }
  // const { puuid } = req.query;
  try {
    const itemData = await fetchMatches();
    res.status(200).json({ success: true, data: itemData });
  } catch (error) {
    console.error('Failed to fetch match data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
}
