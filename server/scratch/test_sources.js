const axios = require('axios');
const cheerio = require('cheerio');

const tests = [
  'https://www.railyatri.in/trains-between-stations?from_station=SC&to_station=BZA',
  'https://www.ixigo.com/trains-between-stations/secunderabad-sc-to-vijayawada-bza',
  'https://www.trainman.in/trains-between-stations/secunderabad-sc-to-vijayawada-bza',
  'https://erail.in/data.aspx?Action=TRAINBTWSTN&Password=2012&Data1=SC&Data2=BZA&Cache=true',
];

(async () => {
  for (const url of tests) {
    try {
      const r = await axios.get(url, {
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
          Accept: 'text/html,application/json',
        },
        maxRedirects: 5,
      });
      const body = String(r.data);
      console.log('\n===', url);
      console.log('status', r.status, 'len', body.length);
      console.log('snippet', body.slice(0, 250).replace(/\s+/g, ' '));

      if (body.includes('^') || body.includes('~')) {
        const parts = body.split('^').slice(1, 3);
        parts.forEach((p, i) => console.log('part', i, p.slice(0, 120)));
      }

      const $ = cheerio.load(body);
      const rows = $('tr').filter((_, el) => /\b\d{5}\b/.test($(el).text()));
      console.log('train rows in table', rows.length);
      if (rows.length) {
        console.log('first row', $(rows[0]).text().replace(/\s+/g, ' ').trim().slice(0, 200));
      }
    } catch (e) {
      console.log('\n=== FAIL', url, e.message);
    }
  }
})();
