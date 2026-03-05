# BISdle Maintenance Guide

## When a New TFT Set Releases

### Champion data updates automatically

A GitHub Actions workflow (`.github/workflows/update-champions.yml`) runs every Monday
at 10am UTC. It scrapes https://tftactics.gg/champions/, updates `lib/championData.json`
if anything changed, and pushes a commit — which triggers an automatic Vercel redeploy.

**You don't need to do anything.** Within a week of a new set dropping, the app will
update itself.

To trigger an immediate update manually (e.g. right after a new set drops):
1. Go to your repo on GitHub
2. Click **Actions** → **Update Champion Data** → **Run workflow**

To run the scraper locally:
```bash
node lib/scrapeChampionData.js
```

### (Optional) Update Player PUUID

If the current player stops playing, find a new high-ranked player and get their PUUID
from the Riot API:

```
https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
```

Update in both:
- `pages/api/tftMatches.js` (line ~20)
- `pages/api/refreshCache.js` (line ~20)

---

## Deployment Checklist

- [ ] Verify GitHub Actions workflow is enabled in repo settings
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
✅ Champion images (via Data Dragon API — uses `img/champion/*.png` square portraits)  
✅ Data Dragon version (auto-fetches latest)  
✅ Champion list + traits (via GitHub Actions cron job, every Monday)

---

## Current Set Info

- **Set:** TFT Set 16
- **Champions:** 101 (as of last update)
- **Data Source Player:** wasianiverson
- **PUUID:** `k1mmHTo465mrs4jVnOd6AGyjzJ6SSJOk0VgvBgEt6vELFO4K9juwI4fcNDRAOzM-VtASmLbipjyWUA`

---

## Architecture Notes

### Champion Name Format
`championData.json` uses proper display names with spaces (e.g. `"Xin Zhao"`, `"Dr Mundo"`,
`"Aurelion Sol"`). A `championNameMap` in `index.js` handles the mapping from compact TFT
IDs (e.g. `XinZhao`) to display names at runtime — no manual name formatting required.

### Data Files
| File | Purpose |
|---|---|
| `lib/championData.json` | Champion list + classes/origins. Single source of truth. Auto-updated by CI. |
| `lib/scrapeChampionData.js` | Playwright scraper that writes to `championData.json`. |
| `.github/workflows/update-champions.yml` | Scheduled GitHub Actions workflow that runs the scraper weekly. |

---

## Troubleshooting

**Images not loading?**

- Check that Data Dragon has been updated for the new set
- Console should log the Data Dragon version on load
- TFT-exclusive units (e.g. Tibbers, Rift Herald) have no regular LoL portrait — they are
  hidden gracefully via `onError`

**No champion data?**

- Verify player is actively playing the new set
- Check Riot API key hasn't expired (renew every 24 hours for dev keys)

**Stats resetting?**

- User stats are stored in browser localStorage
- They persist between sets automatically

**GitHub Actions workflow failing?**

- Check the Actions tab in GitHub for error logs
- Ensure the repo has write permissions for the workflow:
  Go to **Settings** → **Actions** → **General** → set "Workflow permissions" to
  **Read and write permissions**
- Re-run the scraper locally to verify it still works: `node lib/scrapeChampionData.js`
- If tftactics.gg changes their page structure, the scraper selectors may need updating
