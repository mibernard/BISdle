const puppeteer = require('puppeteer');

async function fetchImageAlts(url) {
  let alts = []; // Initialize alts to avoid returning undefined
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
    headless: true, // Runs browser in headless mode
  });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    // Additional logic and evaluation...
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
