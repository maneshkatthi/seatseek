const axios = require('axios');
const fs = require('fs');
const path = require('path');

(async () => {
  const js = (await axios.get('https://erail.in/js5/cmp/erail_all_35.js?v=s2013ef3e2d7dd1e1d123', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })).data;

  const patterns = ['GetTrains2', 'getTrains.aspx', 'GetTrainsByID', 'TRAINBTW', 'Between'];
  for (const p of patterns) {
    let idx = 0;
    let count = 0;
    while ((idx = js.indexOf(p, idx)) !== -1 && count < 3) {
      console.log(`\n=== ${p} #${count} at ${idx} ===`);
      console.log(js.slice(idx, idx + 350));
      idx += p.length;
      count++;
    }
  }
})();
