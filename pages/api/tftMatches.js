//   //dishsoaps puuid = oK8ZzbXf2vNt3NThnpjB0ISlFca-RseO3J1REaPijty8Skl88MLKw3rBY0ZfDcLw49-3q1WCY8zVrA
//   //k3soju1 puuid = oEQIUNhEAVbubo-O5imrcKRzpqqNZtyCk9W1drEAa-MVGCXsF5Gb0sZIgol2MjNiHY6I_fLUJtVRag

import axios from 'axios';

// Cache configuration
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// In-memory cache (works for local dev, limited on Vercel serverless)
let cachedData = null;
let cacheTimestamp = null;
let isFetching = false;

// For Vercel: Try to use KV storage if available
let kvCache = null;
try {
  if (process.env.KV_REST_API_URL) {
    kvCache = require('@vercel/kv');
  }
} catch (e) {
  // KV not available, will use in-memory cache only
}

/**
 * Fetches match data from Riot API and processes champion-item combinations
 */
async function fetchMatches() {
  console.log('Fetching fresh data from Riot API...');
  const region = 'americas';
  const puuid = 'JtYuuhjFb2_dBhoDOB-Qq09d_5GaGi91hsSBcGchiFzn15dFqk1vuZQptgRE0E5FJYsDqkbNLU-L7w'; //wasianiverson's puuid
  // const puuid = '6DF8bd0o98ejI3fDpBOQG_U4FOkSK9rQM83GrxfIBZykQ0qonWmUjv0WmrAdSXCvBUUW5Acw1W4tKA'; //im jack#tft 's puuid
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

  console.log(`Successfully fetched data for ${Object.keys(championItems).length} champions`);
  return championItems;
}


/**
 * Get cached data from Vercel KV or in-memory cache
 */
async function getCachedData() {
  // Try Vercel KV first (persists across serverless invocations)
  if (kvCache) {
    try {
      const data = await kvCache.kv.get('tft-match-data');
      const timestamp = await kvCache.kv.get('tft-match-data-timestamp');
      if (data && timestamp) {
        return { data, timestamp };
      }
    } catch (error) {
      console.log('KV cache miss or error:', error.message);
    }
  }

  // Fallback to in-memory cache (works locally, limited on Vercel)
  if (cachedData && cacheTimestamp) {
    return { data: cachedData, timestamp: cacheTimestamp };
  }

  return null;
}

/**
 * Set cached data in both Vercel KV and in-memory
 */
async function setCachedData(data, timestamp) {
  // Store in memory
  cachedData = data;
  cacheTimestamp = timestamp;

  // Store in Vercel KV if available
  if (kvCache) {
    try {
      await kvCache.kv.set('tft-match-data', data);
      await kvCache.kv.set('tft-match-data-timestamp', timestamp);
      console.log('Data cached in Vercel KV');
    } catch (error) {
      console.log('Failed to cache in KV:', error.message);
    }
  }
}

/**
 * API handler that serves cached data or fetches fresh data if needed
 */
export default async function handler(req, res) {
  try {
    // Set cache headers for Vercel Edge Network caching
    // This tells Vercel to cache the response for 24 hours
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');

    // Try to get cached data
    const cached = await getCachedData();
    
    if (cached) {
      const cacheAge = Date.now() - cached.timestamp;
      const hoursOld = (cacheAge / (1000 * 60 * 60)).toFixed(1);
      
      // If cache is still valid, serve it
      if (cacheAge < CACHE_DURATION) {
        console.log(`Serving cached data (${hoursOld} hours old)`);
        return res.status(200).json({
          success: true,
          data: cached.data,
          cached: true,
          cacheAge: hoursOld + ' hours'
        });
      }
      
      // Cache is stale, but serve it while refreshing in background
      console.log(`Cache is stale (${hoursOld} hours old), serving stale data and refreshing...`);
      
      // Trigger background refresh (non-blocking)
      if (!isFetching) {
        updateCacheInBackground();
      }
      
      return res.status(200).json({
        success: true,
        data: cached.data,
        cached: true,
        cacheAge: hoursOld + ' hours',
        stale: true
      });
    }

    // No cache available, fetch fresh data
    console.log('No cached data available, fetching fresh data...');
    
    if (isFetching) {
      // Another request is already fetching, wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      const retryCache = await getCachedData();
      if (retryCache) {
        return res.status(200).json({
          success: true,
          data: retryCache.data,
          cached: true
        });
      }
    }

    isFetching = true;
    try {
      const freshData = await fetchMatches();
      await setCachedData(freshData, Date.now());
      
      return res.status(200).json({
        success: true,
        data: freshData,
        cached: false
      });
    } finally {
      isFetching = false;
    }

  } catch (error) {
    console.error('Failed to fetch match data:', error);
    
    // Try to serve stale cache on error
    const cached = await getCachedData();
    if (cached) {
      console.log('Error occurred, serving stale cache');
      return res.status(200).json({
        success: true,
        data: cached.data,
        cached: true,
        stale: true,
        warning: 'Serving stale data due to fetch error'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
      error: error.message
    });
  }
}

/**
 * Update cache in background (non-blocking)
 */
async function updateCacheInBackground() {
  isFetching = true;
  try {
    const freshData = await fetchMatches();
    await setCachedData(freshData, Date.now());
    console.log('Background cache refresh completed');
  } catch (error) {
    console.error('Background cache refresh failed:', error.message);
  } finally {
    isFetching = false;
  }
}
