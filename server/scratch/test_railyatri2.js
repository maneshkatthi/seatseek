const axios = require('axios');

(async () => {
  const html = (await axios.get('https://www.railyatri.in/trains-between-stations?from_station=SC&to_station=BZA', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })).data;

  const matches = [...String(html).matchAll(/https?:\/\/[^"'\s]+(?:train|between|station)[^"'\s]*/gi)].slice(0, 30);
  console.log('url matches', matches.map((m) => m[0]).join('\n'));

  const apiCandidates = [
    'https://www.railyatri.in/api/common/train-between-stations?from_station=SC&to_station=BZA',
    'https://www.railyatri.in/api/v4/train-between-stations?from_station=SC&to_station=BZA',
    'https://www.railyatri.in/api/v1/train-between-stations?from_station=SC&to_station=BZA',
    'https://m.railyatri.in/api/common/train-between-stations?from_station=SC&to_station=BZA',
  ];

  for (const url of apiCandidates) {
    try {
      const r = await axios.get(url, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
      });
      console.log('\nOK', url, 'type', typeof r.data, 'keys', typeof r.data === 'object' ? Object.keys(r.data) : r.data?.slice?.(0, 100));
    } catch (e) {
      console.log('FAIL', url, e.response?.status || e.message);
    }
  }
})();
