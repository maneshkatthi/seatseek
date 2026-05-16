const axios = require('axios');
const cheerio = require('cheerio');

const urls = [
  'https://www.confirmtkt.com/trains-between-stations/secunderabad-sc-to-vijayawada-jn-bza',
  'https://www.confirmtkt.com/trains-between-stations/sc/bza',
  'https://www.goibibo.com/trains/check-train-between-stations/?srcStn=SC&destStn=BZA',
  'https://www.cleartrip.com/trains/results?from_station=SC&to_station=BZA',
  'https://indiarailinfo.com/trains/SC/BZA',
];

(async () => {
  for (const url of urls) {
    try {
      const r = await axios.get(url, {
        timeout: 20000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
        maxRedirects: 5,
      });
      const body = String(r.data);
      const $ = cheerio.load(body);
      const rows = $('tr').filter((_, el) => /\b\d{5}\b/.test($(el).text()));
      const next = $('#__NEXT_DATA__').html();
      console.log('\n', url);
      console.log('len', body.length, 'train rows', rows.length, 'has next', !!next);
      if (rows.length) console.log('row0', $(rows[0]).text().replace(/\s+/g, ' ').trim().slice(0, 150));
      if (next) {
        const p = JSON.parse(next);
        const s = JSON.stringify(p.props?.pageProps || {}).slice(0, 400);
        console.log('next snippet', s);
      }
      if (body.includes('train_number') || body.includes('trainNumber')) {
        const m = body.match(/train_number[^,]{0,80}/);
        console.log('train_number in html', m?.[0]);
      }
    } catch (e) {
      console.log('\n FAIL', url, e.response?.status || e.message);
    }
  }
})();
