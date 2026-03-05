// scrapeChampionData.js
// Usage: node lib/scrapeChampionData.js
// Scrapes Set 16 champion trait data from tftactics.gg and writes to lib/championData.json

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE = 'https://tftactics.gg';

function normalizeChampionName(slug) {
  // Convert URL slug to a clean display name
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function extractTraits(page) {
  return page.evaluate(() => {
    const origins = [];
    const classes = [];

    document.querySelectorAll('h4').forEach((h4) => {
      const text = h4.textContent.trim();
      if (text === 'Origin' || text === 'Class') {
        const parent = h4.parentElement;
        const h2 = parent ? parent.querySelector('h2') : null;
        if (h2) {
          const traitName = h2.textContent.trim();
          if (text === 'Origin') origins.push(traitName);
          else classes.push(traitName);
        }
      }
    });

    return { origins: [...new Set(origins)], classes: [...new Set(classes)] };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  // Block ads/trackers to speed up scraping
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (
      url.includes('googletag') ||
      url.includes('doubleclick') ||
      url.includes('ad.') ||
      url.includes('analytics') ||
      url.includes('overwolf') ||
      url.includes('amazon-adsystem') ||
      url.includes('scorecardresearch') ||
      url.includes('adsafeprotected') ||
      url.includes('intergient') ||
      url.includes('yellowblue') ||
      url.includes('bidr.io') ||
      url.includes('pubads')
    ) {
      route.abort();
    } else {
      route.continue();
    }
  });

  console.error('Fetching champion list...');
  await page.goto(`${BASE}/champions/`, { waitUntil: 'networkidle', timeout: 30000 });

  // Get all champion page links
  const championSlugs = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/champions/"]'));
    return [
      ...new Set(
        links
          .map((a) => a.getAttribute('href'))
          .filter((href) => href && href !== '/champions/' && !href.includes('?'))
          .map((href) => href.replace(/^\/champions\//, '').replace(/\/$/, ''))
          .filter(Boolean)
      ),
    ];
  });

  console.error(`Found ${championSlugs.length} champions`);

  const championData = {};

  for (const slug of championSlugs) {
    const url = `${BASE}/champions/${slug}/`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      const { origins, classes } = await extractTraits(page);

      // Use the display name from h1 if available, otherwise normalize slug
      const displayName = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.textContent.replace(/^TFT\s+/i, '').trim() : null;
      });

      const name = displayName || normalizeChampionName(slug);
      championData[name] = { classes, origins };
      console.error(`  ✓ ${name}: classes=${JSON.stringify(classes)} origins=${JSON.stringify(origins)}`);
    } catch (e) {
      const name = normalizeChampionName(slug);
      console.error(`  ✗ Failed for ${slug}: ${e.message}`);
      championData[name] = { classes: [], origins: [] };
    }
  }

  await browser.close();

  const outputPath = join(__dirname, 'championData.json');
  writeFileSync(outputPath, JSON.stringify(championData, null, 2));
  console.error(`\nWrote ${Object.keys(championData).length} champions to ${outputPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
