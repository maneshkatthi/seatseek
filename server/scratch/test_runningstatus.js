const axios = require('axios');
const cheerio = require('cheerio');

const urls = [
  'https://runningstatus.in/trains-between/sc/bza',
  'https://runningstatus.in/trains-between-stations/sc/bza',
  'https://www.trainspnrstatus.com/trains-between-stations/sc-to-bza',
];

(async () => {
  for (const url of urls) {
    try {
      const r = await axios.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } });
      const $ = cheerio.load(r.data);
      const rows = $('table tr').filter((_, el) => /\d{5}/.test($(el).text()));
      console.log(url, 'rows', rows.length);
      if (rows.length) console.log($(rows[0]).text().replace(/\s+/g, ' ').trim().slice(0, 150));
    } catch (e) {
      console.log('FAIL', url, e.response?.status || e.message);
    }
  }
})();
