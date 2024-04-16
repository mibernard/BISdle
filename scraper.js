const puppeteer = require('puppeteer');

async function fetchImageAlts(url) {
  let alts = []; // Initialize alts to avoid returning undefined
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const test = await page.evaluate(() => document.title);
    console.log('Page title is:', test);

    // Assuming you would process 'alts' here...
    // Example, just to illustrate:
    alts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.ItemDetailHolders img.TableItemImg'))
        .slice(0, 3)
        .map((img) => img.alt);
    });
  } catch (error) {
    console.error('Error during page operations:', error);
  } finally {
    await browser.close();
  }
  return alts;
}

module.exports = fetchImageAlts;
