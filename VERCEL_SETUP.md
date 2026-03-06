# Quick Vercel Setup Guide

## ✅ What's Already Working

The caching system is **already configured** and will work on Vercel with **zero additional setup**!

- ✅ Vercel Edge Network caching (automatic — primary mechanism)
- ✅ Stale-while-revalidate strategy (automatic)
- ⚠️ In-memory caching is **not reliable on Vercel** — each serverless invocation typically gets a fresh instance, so the in-memory cache rarely hits. Edge Network caching is what actually handles repeat traffic.

## 🚀 Deploy Now (Basic Setup)

1. **Set Environment Variable**:
   ```bash
   # In Vercel Dashboard → Settings → Environment Variables
   RIOT_API_KEY=your_riot_api_key_here
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

That's it! Your site will:
- Cache data for 24 hours automatically
- Serve unlimited users without hitting rate limits
- Refresh cache automatically when it expires

## 🔧 Optional Enhancements

### Option A: Add Cron Job (Proactive Refresh)

**Why?** Refreshes cache daily before it expires, ensuring users never wait.

**Setup**:
1. Add environment variable in Vercel:
   ```
   CRON_SECRET=any_random_secure_string_here
   ```
2. The `vercel.json` file already configures the cron job
3. Deploy: `vercel --prod`

**Cost**: Free (1 cron job included)

## 📊 Monitoring

Check if caching is working:

1. **Browser DevTools** → Network tab → Check `/api/tftMatches` response:
   ```json
   {
     "cached": true,
     "cacheAge": "2.5 hours"
   }
   ```

2. **Vercel Logs** → Look for:
   - `Serving cached data` ✅ Good!
   - `Fetching fresh data` 🔄 Normal on first request or after 24h

## 🎯 Expected Behavior

### Scenario 1: First User of the Day
- Request takes ~2-3 seconds (fetching from Riot API)
- Data is cached for 24 hours

### Scenario 2: Subsequent Users (within 24 hours)
- Request takes ~100ms (served from Edge cache)
- No API calls to Riot
- Unlimited users supported

### Scenario 3: After 24 Hours
- First user triggers refresh
- Gets stale data immediately (fast)
- Fresh data loads in background
- Next user gets fresh data

## ⚠️ Important Notes

1. **Development API Keys Expire**: Riot dev keys expire every 24 hours. For production, apply for a production key at https://developer.riotgames.com/

2. **Cache Headers**: The `Cache-Control` header is set to cache for 24 hours on Vercel's Edge Network. This is the primary caching mechanism.

3. **Serverless Limitations**: In-memory cache does **not** reliably persist on Vercel — different invocations run in different instances. Edge Network caching (`Cache-Control: s-maxage`) is the actual caching layer and handles all repeat traffic.

## 🐛 Troubleshooting

### Problem: "Failed to fetch data" errors
**Solution**: Check if your Riot API key is valid and set in Vercel environment variables

### Problem: Data seems old
**Solution**: Cache refreshes every 24 hours by design. To force refresh:
- Redeploy your app, or
- Set up the cron job for automatic daily refresh

### Problem: Still seeing high API usage
**Solution**: 
1. Check Vercel logs to see if Edge caching is working
2. Verify `Cache-Control` headers are being sent in response
3. Set up the cron job for proactive cache refresh

## 📞 Need Help?

See `DEPLOYMENT.md` for detailed technical documentation.

