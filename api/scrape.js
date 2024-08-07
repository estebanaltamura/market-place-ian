import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

export default async function handler(req, res) {
  let browser = null;
  console.log('entro a la serverless');
  try {
    browser = await puppeteer.launch({
      args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://www.khanacademy.org/profile/idev0x00', { waitUntil: 'networkidle0' });
    const content = await page.content();

    res.status(200).send(content);
  } catch (error) {
    console.error('Error fetching the page:', error); // Más detalles del error
    res.status(500).send('Error fetching the page');
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
