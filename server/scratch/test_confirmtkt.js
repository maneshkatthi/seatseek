const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const url = 'https://www.confirmtkt.com/trains-between-stations/sc/bza';
  const r = await axios.get(url, {
    timeout: 20000,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
  });
  const $ = cheerio.load(r.data);

  console.log('title', $('title').text());
  const selectors = [
    '.train-row', '.trainRow', '[data-train]', '.train-list-item',
    '.train-between', '.train-card', 'table tbody tr', '.listing-card',
  ];
  for (const sel of selectors) {
    const n = $(sel).length;
    if (n) console.log(sel, n, $(sel).first().text().replace(/\s+/g, ' ').trim().slice(0, 120));
  }

  $('tr').each((i, el) => {
    const t = $(el).text();
    if (/\d{5}/.test(t) && i < 5) console.log('tr', i, t.replace(/\s+/g, ' ').trim().slice(0, 200));
  });

  const scripts = $('script').map((_, el) => $(el).html() || '').get();
  const trainScript = scripts.find((s) => s.includes('trainNumber') || s.includes('train_number') || s.includes('departureTime'));
  if (trainScript) {
    console.log('found train script len', trainScript.length);
    const jsonMatch = trainScript.match(/\{[\s\S]{0,500}trainNumber[\s\S]{0,500}\}/);
    console.log('json match', jsonMatch?.[0]?.slice(0, 400));
  }

  // look for window.__INITIAL_STATE__ or similar
  for (const s of scripts) {
    if (s.includes('__INITIAL') || s.includes('trainList') || s.includes('betweenStation')) {
      console.log('interesting script start', s.slice(0, 300));
    }
  }

  const ld = $('script[type="application/ld+json"]').html();
  if (ld) console.log('ld+json', ld.slice(0, 300));

  // class names with train
  const classes = new Set();
  $('[class]').each((_, el) => {
    const c = $(el).attr('class') || '';
    if (/train/i.test(c)) classes.add(c.split(' ').find((x) => /train/i.test(x)));
  });
  console.log('train classes sample', [...classes].slice(0, 20));
})();
