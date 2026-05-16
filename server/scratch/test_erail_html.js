const axios = require('axios');
const fs = require('fs');

(async () => {
  const r = await axios.get('https://erail.in/trains-between-stations.aspx?From=SC&To=BZA', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const html = String(r.data);
  const patterns = ['getTrains', 'getTrain', 'Action=', 'data.aspx', 'ajax', 'Between', 'TRAIN'];
  for (const p of patterns) {
    const idx = html.indexOf(p);
    if (idx >= 0) console.log(p, 'at', idx, html.slice(idx, idx + 120));
  }
  const matches = [...html.matchAll(/data\.aspx\?[^"']+/g)].map((m) => m[0]);
  console.log('data.aspx urls', [...new Set(matches)]);

  const actions = [...html.matchAll(/Action=([A-Z_]+)/g)].map((m) => m[1]);
  console.log('actions', [...new Set(actions)]);

  // try various erail data actions
  const actionsToTry = ['TRAINBTWSTN', 'TRAINBETWEEN', 'BETWEENSTN', 'TRAINLIST', 'TRAINBETWEENSTATIONS'];
  for (const action of actionsToTry) {
    try {
      const u = `https://erail.in/data.aspx?Action=${action}&Password=2012&Data1=SC&Data2=BZA&Cache=true`;
      const res = await axios.get(u, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(action, 'len', String(res.data).length, 'start', String(res.data).slice(0, 80));
    } catch (e) {
      console.log(action, 'err', e.message);
    }
  }
})();
