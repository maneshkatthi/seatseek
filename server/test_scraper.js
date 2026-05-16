const axios = require('axios');
const UserAgent = require('user-agents');

const getUserAgent = () => {
  const userAgent = new UserAgent({ deviceCategory: 'desktop' });
  return userAgent.toString();
};

const test = async () => {
  const from = 'SC';
  const to = 'BZA';
  try {
    const url = `https://erail.in/rail/getTrains.aspx?From=${from}&To=${to}`;
    console.log('Fetching:', url);
    const response = await axios.get(url, {
      headers: { 
        'User-Agent': getUserAgent(),
        'Referer': 'https://erail.in/'
      }
    });

    const rawData = response.data;
    console.log('Raw data length:', rawData.length);
    console.log('Raw data start:', rawData.substring(0, 500));

    const sections = rawData.split('~~~~~~~~');
    console.log('Sections count:', sections.length);
    
    const mainSection = sections[0];
    const trainsRaw = mainSection.split('^').slice(1);
    console.log('Trains found:', trainsRaw.length);

    if (trainsRaw.length > 0) {
        console.log('Sample train:', trainsRaw[0].split('~').slice(0, 5));
    } else {
        console.log('No trains found in response.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

test();
