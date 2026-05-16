const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const testCases = [
  { name: 'Telangana Express (12724)', url: '/live/12724' },
  { name: 'Charminar Express (12760)', url: '/live/12760' },
  { name: 'Rajdhani Express (12951)', url: '/live/12951' },
  { name: 'Invalid Train (99999)', url: '/live/99999', expectedStatus: 400 },
  { name: 'Same Station (SC -> SC)', url: '/between/SC/SC', expectedStatus: 400 },
  { name: 'Trains Between (SC -> BZA)', url: '/between/SC/BZA' }
];

async function runTests() {
  console.log('=========================================');
  console.log('   SEATSEEK BACKEND TEST SUITE   ');
  console.log('=========================================\n');

  for (const tc of testCases) {
    const startTime = Date.now();
    try {
      const response = await axios.get(`${BASE_URL}${tc.url}`);
      const duration = Date.now() - startTime;
      const expected = tc.expectedStatus || 200;

      if (response.status === expected) {
        console.log(`[PASS] ${tc.name}`);
      } else {
        console.log(`[FAIL] ${tc.name} (Expected ${expected}, got ${response.status})`);
      }
      
      console.log(`       Status: ${response.status}`);
      console.log(`       Time: ${duration}ms`);
      if (tc.url.includes('live') && response.status === 200) {
        console.log(`       Source: ${response.data.dataSource || 'N/A'}`);
        console.log(`       Current: ${response.data.currentStation}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const expected = tc.expectedStatus || 200;
      if (error.response && error.response.status === expected) {
        console.log(`[PASS] ${tc.name} (Expected Error)`);
        console.log(`       Status: ${error.response.status}`);
        console.log(`       Message: ${error.response.data.message}`);
      } else {
        console.log(`[FAIL] ${tc.name}`);
        console.log(`       Error: ${error.message}`);
        if (error.response) console.log(`       Data: ${JSON.stringify(error.response.data)}`);
      }
    }
    console.log('-----------------------------------------');
  }
}

runTests();
