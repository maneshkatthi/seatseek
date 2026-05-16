const axios = require('axios');
const cheerio = require('cheerio');

const urls = [
  'https://erail.in/rail/getTrains.aspx?Station_From=SC&Station_To=BZA&DataSource=0&Language=0&Cache=true',
  'https://erail.in/rail/getTrains.aspx?From=SC&To=BZA',
  'https://erail.in/rail/getTrains.aspx?Station_From=GLA&Station_To=KMT&DataSource=0&Language=0&Cache=true',
];

(async () => {
  for (const url of urls) {
    try {
      const r = await axios.get(url, {
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          Referer: 'https://erail.in/trains-between-stations.aspx?From=SC&To=BZA',
        },
      });
      const data = String(r.data);
      console.log('\n', url.split('?')[1]);
      console.log('len', data.length, 'start', data.slice(0, 150));
      if (data.includes('^')) {
        const trains = data.split('^').slice(1, 4);
        trains.forEach((t, i) => {
          const d = t.split('~');
          console.log('train', i, 'no', d[0], 'name', d[1], 'dep', d[10], 'arr', d[11], 'dur', d[12]);
        });
      }
    } catch (e) {
      console.log('FAIL', url, e.message);
    }
  }

  // Also test HTML table after ajax - MakeTrainListTable might render HTML
  const htmlUrl = 'https://erail.in/rail/getTrains.aspx?Station_From=SC&Station_To=BZA&DataSource=0&Language=0&Cache=false';
  const html = (await axios.get(htmlUrl, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://erail.in/' } })).data;
  const $ = cheerio.load(String(html));
  console.log('\nHTML parse: tr count', $('tr').length);
  $('tr').slice(0, 3).each((i, el) => console.log('tr', i, $(el).text().replace(/\s+/g, ' ').trim().slice(0, 120)));
})();
