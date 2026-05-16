const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const r = await axios.get('https://erail.in/trains-between-stations.aspx?From=SC&To=BZA', {
    timeout: 15000,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
  });
  const $ = cheerio.load(r.data);
  console.log('tables', $('table').length);
  $('table').each((i, t) => {
    const rows = $(t).find('tr').length;
    if (rows > 3) {
      console.log('table', i, 'rows', rows, 'first', $(t).find('tr').first().text().replace(/\s+/g, ' ').trim().slice(0, 120));
    }
  });
  $('tr').slice(0, 8).each((i, el) => {
    console.log('tr', i, $(el).text().replace(/\s+/g, ' ').trim().slice(0, 180));
  });
  const scripts = $('script').map((_, el) => $(el).html() || '').get();
  const withTrain = scripts.filter((s) => /train/i.test(s) && s.length > 200);
  console.log('scripts with train', withTrain.length);
  withTrain.slice(0, 2).forEach((s, i) => console.log('script', i, s.slice(0, 300)));

  // try getTrains API again with GLA-KMT
  const r2 = await axios.get('https://erail.in/rail/getTrains.aspx?From=GLA&To=KMT', {
    timeout: 15000,
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  console.log('GLA-KMT api len', String(r2.data).length, 'snippet', String(r2.data).slice(0, 200));
})();
