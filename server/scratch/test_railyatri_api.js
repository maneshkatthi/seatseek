const axios = require('axios');

(async () => {
  const html = (await axios.get('https://www.railyatri.in/trains-between-stations?from_station=SC&to_station=BZA', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })).data;

  const apiUrls = [...String(html).matchAll(/"(https?:\/\/[^"]+api[^"]+)"/gi)].map((m) => m[1]);
  console.log('api urls in page', [...new Set(apiUrls)].slice(0, 20));

  const ryUrls = [...String(html).matchAll(/https:\/\/[^"'\s]*railyatri[^"'\s]*/gi)].map((m) => m[0]);
  const unique = [...new Set(ryUrls)].filter((u) => u.includes('train') || u.includes('between') || u.includes('station'));
  console.log('train related', unique.slice(0, 15));
})();
