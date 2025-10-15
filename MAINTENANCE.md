# BISdle Maintenance Guide

## When a New TFT Set Releases

### Required Updates (30-45 minutes)

#### 1. Update Champion Names (`lib/champions.js`)

- Visit https://tftactics.gg/champions/
- Copy all champion names from the new set
- Replace the array with new champions
- Use exact spelling (e.g., `'JarvanIV'`, `'KSante'`, `'DrMundo'`)

#### 2. Update Champion Traits (`lib/championData.js`)

- Visit https://tftactics.gg/champions/
- For each champion, note their traits
- Separate into `classes` (combat traits) and `origins` (thematic traits)
- Format: `ChampionName: { classes: ['Class1'], origins: ['Origin1'] }`
- If no class, use empty array: `classes: []`

#### 3. (Optional) Update Player PUUID

- If current player stops playing, find a new high-ranked player
- Get their PUUID from Riot API:
  ```
  https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
  ```
- Update in both:
  - `pages/api/tftMatches.js` (line ~20)
  - `pages/api/refreshCache.js` (line ~20)

---

## Deployment Checklist

- [ ] Update `lib/champions.js`
- [ ] Update `lib/championData.js`
- [ ] (Optional) Update player PUUID
- [ ] Test locally: `npm run dev`
- [ ] Verify champion images load
- [ ] Verify item images load
- [ ] Verify hint emblems load
- [ ] Test Daily and Unlimited modes
- [ ] Commit and push to GitHub
- [ ] Verify production deployment

---

## What Updates Automatically

✅ Items (via Data Dragon API)  
✅ Trait emblems (via Data Dragon API)  
✅ Data Dragon version (auto-fetches latest)

---

## Current Set Info

- **Set:** TFT Set 15
- **Champions:** 58 (as of last update)
- **Data Source Player:** wasianiverson
- **PUUID:** `k1mmHTo465mrs4jVnOd6AGyjzJ6SSJOk0VgvBgEt6vELFO4K9juwI4fcNDRAOzM-VtASmLbipjyWUA`

---

## Troubleshooting

**Images not loading?**

- Check Data Dragon is updated for new set
- Console should log Data Dragon version

**No champion data?**

- Verify player is actively playing the new set
- Check Riot API key hasn't expired (renew every 24 hours for dev keys)

**Stats resetting?**

- User stats are stored in browser localStorage
- They persist between sets automatically
