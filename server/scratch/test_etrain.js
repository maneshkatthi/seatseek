const axios = require('axios');
const cheerio = require('cheerio');

const urls = [
  'https://etrain.info/trains-between-stations/SC/BZA',
  'https://etrain.info/trn/SC/BZA',
  'https://www.trainenquiry.com/trains-between-stations/sc/bza',
];

(async () => {
  for (const url of urls) {
    try {
      const r = await axios.get(url, {
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          Referer: 'https://etrain.info/',
        },
      });
      const $ = cheerio.load(r.data);
      const rows = $('tr').filter((_, el) => /\b\d{5}\b/.test($(el).text()));
      console.log('\n', url, 'len', String(r.data).length, 'rows', rows.length);
      if (rows.length) {
        $(rows).slice(0, 2).each((i, el) => console.log('row', $(el).text().replace(/\s+/g, ' ').trim().slice(0, 180)));
        console.log('html sample', $(rows[0]).html()?.slice(0, 400));
      }
      const divs = $('.train, .train-row, [id*="train"]');
      console.log('train divs', divs.length);
    } catch (e) {
      console.log('FAIL', url, e.response?.status || e.message);
    }
  }

  // erail with referer + retry
  for (let i = 0; i < 3; i++) {
    const r = await axios.get('https://erail.in/rail/getTrains.aspx?From=SC&To=BZA', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Referer: 'https://erail.in/trains-between-stations.aspx?From=SC&To=BZA',
      },
    });
    console.log('erail attempt', i, String(r.data).slice(0, 100));
    await new Promise((res) => setTimeout(res, 2000));
  }
})();
