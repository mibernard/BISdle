const chromium = require('chrome-aws-lambda');

async function fetchImageAlts(url) {
  console.log('inside fetchImageAlts');
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });
    const page = await browser.newPage();

    // await page.setRequestInterception(true);
    // page.on('request', (req) => {
    //   const resourceType = req.resourceType();
    //   if (
    //     [
    //       // 'image',
    //       // 'stylesheet',
    //       // 'script',
    //       // 'xhr',
    //       'font',
    //       'media',
    //       'texttrack',
    //       'eventsource',
    //       'websocket',
    //       'other',
    //       'manifest',
    //       // 'document',
    //       'fetch',
    //       'other',
    //     ].includes(resourceType)
    //   ) {
    //     req.abort();
    //   } else {
    //     req.continue();
    //   }
    // });

    await page.goto(url, { waitUntil: 'networkidle0' });
    const alts = await page.evaluate(() => {
      // return Array.from(document.querySelectorAll('.ItemDetailHolders img.TableItemImg'))
      return Array.from(document.querySelectorAll('img.m-1kqfjcf'))
        .slice(0, 3)
        .map((img) => img.alt);
    });
    return alts;
  } catch (error) {
    console.error('Error during scraping:', error.message);
    return null; // handle error appropriately
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

module.exports = fetchImageAlts;
