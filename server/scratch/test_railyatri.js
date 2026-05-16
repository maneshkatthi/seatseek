const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const url = 'https://www.railyatri.in/trains-between-stations?from_station=SC&to_station=BZA';
  const r = await axios.get(url, {
    timeout: 20000,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
  });
  const $ = cheerio.load(r.data);

  const nextData = $('#__NEXT_DATA__').html();
  if (nextData) {
    const parsed = JSON.parse(nextData);
    console.log('next keys', Object.keys(parsed));
    const props = parsed.props?.pageProps;
    console.log('pageProps keys', props ? Object.keys(props) : 'none');
    const str = JSON.stringify(props).slice(0, 2000);
    console.log('pageProps snippet', str);

    // find trains array
    const findTrains = (obj, path = '') => {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj) && obj.length > 0 && obj[0]?.train_number) {
        console.log('FOUND at', path, 'count', obj.length, 'sample', obj[0]);
        return;
      }
      for (const [k, v] of Object.entries(obj)) {
        if (k.toLowerCase().includes('train') && Array.isArray(v) && v.length) {
          console.log('array at', path + '.' + k, 'len', v.length, 'keys', Object.keys(v[0] || {}));
        }
        if (typeof v === 'object') findTrains(v, path + '.' + k);
      }
    };
    findTrains(props, 'pageProps');
  } else {
    console.log('no __NEXT_DATA__');
  }

  // check for API in script
  const scripts = $('script').map((_, el) => $(el).html() || '').get();
  const apiScript = scripts.find((s) => s.includes('train_number') || s.includes('trainNumber'));
  if (apiScript) console.log('script with train_number', apiScript.slice(0, 500));
})();
