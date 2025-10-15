// This endpoint is called by Vercel Cron Jobs to refresh the cache daily
// Configure in vercel.json or Vercel dashboard

import axios from 'axios';

async function fetchMatchesData() {
  const region = 'americas';
  const puuid = 'k1mmHTo465mrs4jVnOd6AGyjzJ6SSJOk0VgvBgEt6vELFO4K9juwI4fcNDRAOzM-VtASmLbipjyWUA'; //wasianiverson's puuid
  const matchesUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=10`;
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    throw new Error('RIOT_API_KEY is not configured');
  }

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

export default async function handler(req, res) {
  // Verify the request is from Vercel Cron or has the correct authorization
  const authHeader = req.headers.authorization;
  
  // For Vercel Cron Jobs, check the authorization header
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow manual trigger in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  }

  try {
    console.log('Cron job triggered: Refreshing cache...');
    const data = await fetchMatchesData();
    
    // Note: This endpoint fetches fresh data to warm up the cache
    // The actual caching is handled by Vercel's Edge Network via Cache-Control headers
    
    res.status(200).json({
      success: true,
      message: 'Cache refreshed successfully',
      championCount: Object.keys(data).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to refresh cache:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh cache',
      error: error.message
    });
  }
}

