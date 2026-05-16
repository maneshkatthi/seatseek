const axios = require('axios');
const fs = require('fs');
const path = require('path');

(async () => {
  const html = (await axios.get('https://erail.in/trains-between-stations.aspx?From=SC&To=BZA', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })).data;

  const scripts = [...String(html).matchAll(/src="([^"]+\.js[^"]*)"/g)].map((m) => m[1]);
  console.log('script count', scripts.length);
  const relevant = scripts.filter((s) => /train|between|cmp|main/i.test(s));
  console.log('relevant', relevant);

  for (const src of relevant.slice(0, 8)) {
    const url = src.startsWith('http') ? src : `https://erail.in${src.startsWith('/') ? '' : '/'}${src}`;
    try {
      const js = (await axios.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } })).data;
      if (/getTrains|Between|btw|TRAIN/i.test(js)) {
        console.log('\n---', url);
        const idx = js.search(/getTrains|BetweenStn|trainBetween/i);
        console.log(js.slice(Math.max(0, idx - 50), idx + 400));
      }
    } catch (e) {
      console.log('skip', url, e.message);
    }
  }
})();
