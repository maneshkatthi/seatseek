const axios = require('axios');
const cheerio = require('cheerio');

const urls = [
  'https://www.ixigo.com/by-train-rail/secunderabad-sc-to-vijayawada-bza',
  'https://www.easemytrip.com/railways/trains-between-stations/sc/bza',
  'https://www.railmitra.com/trains-between-stations/sc-bza',
  'https://www.makemytrip.com/railways/listing?from=SC&to=BZA',
];

(async () => {
  for (const url of urls) {
    try {
      const r = await axios.get(url, {
        timeout: 25000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
      });
      const body = String(r.data);
      const $ = cheerio.load(body);
      const rows = $('tr').filter((_, el) => /\b\d{5}\b/.test($(el).text()));
      console.log('\nOK', url.split('/').slice(2, 5).join('/'), 'len', body.length, 'rows', rows.length);
      if (rows.length) console.log($(rows[0]).text().replace(/\s+/g, ' ').trim().slice(0, 150));
      const hasTrainJson = /"trainNumber"|"train_number"|trainNo/.test(body);
      console.log('hasTrainJson', hasTrainJson);
      if (hasTrainJson) {
        const m = body.match(/"trainNumber"\s*:\s*"\d{5}"/);
        console.log('sample', m?.[0]);
      }
    } catch (e) {
      console.log('FAIL', url, e.response?.status || e.message);
    }
  }
})();
