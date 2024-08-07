import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
app.use(cors()); // Configurar CORS para permitir todas las solicitudes

app.get('/scrape', async (req, res) => {
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://www.khanacademy.org/profile/idev0x00', { waitUntil: 'networkidle0' });
    const content = await page.content();
    console.log(content);
    await browser.close();
    res.send(content);
  } catch (error) {
    res.status(500).send('Error fetching the page');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
