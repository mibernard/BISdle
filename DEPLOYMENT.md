# BISdle Deployment Guide

## Caching Strategy for Vercel

This application implements a multi-layered caching strategy to minimize Riot API calls and avoid rate limits:

### 1. **Vercel Edge Network Caching** (Primary - No Setup Required)
- Uses HTTP cache headers (`Cache-Control: s-maxage=86400`)
- Vercel's CDN caches responses for 24 hours automatically
- **This works out of the box** and is the main caching mechanism
- No additional configuration needed

### 2. **In-Memory Caching** (Secondary - Works Locally)
- Caches data in Node.js memory
- Works great for local development
- Limited on Vercel due to serverless architecture (each function invocation may use a different instance)
- Still provides some benefit when the same serverless instance handles multiple requests

### 3. **Vercel KV Storage** (Optional - Enhanced Persistence)
If you want guaranteed persistence across all serverless invocations:

#### Setup Vercel KV:
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → KV
3. Install the package:
   ```bash
   npm install @vercel/kv
   ```
4. Vercel will automatically set the `KV_REST_API_URL` environment variable
5. The code will automatically use KV when available

### 4. **Vercel Cron Jobs** (Optional - Scheduled Refresh)
To proactively refresh the cache daily:

#### Setup Cron Job:
1. The `vercel.json` file already configures a daily cron job
2. Add a `CRON_SECRET` environment variable in Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add `CRON_SECRET` with a random secure string
3. The cron job will call `/api/refreshCache` daily at midnight UTC

## Deployment Steps

### 1. **Environment Variables**
Set these in your Vercel project settings:

```
RIOT_API_KEY=your_riot_api_key_here
CRON_SECRET=your_random_secret_string (optional, for cron jobs)
```

**Important**: Riot development API keys expire every 24 hours. For production:
- Apply for a production API key at https://developer.riotgames.com/
- Production keys don't expire

### 2. **Deploy to Vercel**
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

### 3. **Verify Caching**
After deployment:
1. Visit your site and check the browser console
2. The API response will include cache metadata:
   ```json
   {
     "success": true,
     "data": {...},
     "cached": true,
     "cacheAge": "2.5 hours"
   }
   ```

## How It Works on Vercel

### First Request:
1. User visits site → Frontend calls `/api/tftMatches`
2. No cache exists → Fetches from Riot API (1 API call)
3. Stores in cache (in-memory + KV if available)
4. Vercel Edge Network caches the response for 24 hours
5. Returns data to user

### Subsequent Requests (within 24 hours):
1. User visits site → Frontend calls `/api/tftMatches`
2. **Vercel Edge Network serves cached response** (0 API calls!)
3. No serverless function is even invoked
4. Ultra-fast response

### After 24 Hours:
1. Cache expires on Edge Network
2. Next request triggers serverless function
3. Function checks KV cache (if available) or fetches fresh data
4. Updates cache and Edge Network
5. Cycle repeats

## Rate Limit Protection

With this setup:
- **Without caching**: ~100 users/day could hit rate limits
- **With Edge caching**: Supports **unlimited users** for 24 hours per cache refresh
- **With KV + Cron**: Proactive refresh ensures cache never expires during peak usage

## Monitoring

Check Vercel logs to monitor cache performance:
- `Serving cached data (X hours old)` - Cache hit ✅
- `No cached data available, fetching fresh data` - Cache miss, fetching from API 🔄
- `Serving stale data due to fetch error` - Fallback to old cache ⚠️

## Troubleshooting

### Issue: High API usage
**Solution**: Verify Edge caching is working by checking response headers in browser DevTools

### Issue: Stale data
**Solution**: 
- Manually call `/api/refreshCache` (requires CRON_SECRET header)
- Or wait for automatic 24-hour refresh

### Issue: Rate limit errors
**Solution**:
- Upgrade to Riot production API key
- Enable Vercel KV for better cache persistence
- Set up cron job for proactive refresh

## Cost Considerations

- **Vercel Edge Caching**: Free (included in all plans)
- **Vercel KV**: Free tier includes 256MB storage (more than enough for this app)
- **Vercel Cron Jobs**: Free tier includes 1 cron job
- **Riot API**: Free for development, production keys available upon request

## Summary

✅ **Current Setup (No Additional Configuration)**:
- Edge caching works automatically
- Handles most traffic without hitting Riot API
- Good for moderate traffic

✅ **Recommended Setup (With KV + Cron)**:
- Add Vercel KV for guaranteed persistence
- Enable cron job for proactive refresh
- Best for high traffic and production use

