const axios = require('axios');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');

const REQUEST_TIMEOUT_MS = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 800;

const getUserAgent = () => new UserAgent({ deviceCategory: 'desktop' }).toString();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const status = error.response?.status;
  if (status === 429 || status === 502 || status === 503 || status === 504) return true;
  return ['ECONNABORTED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'].includes(error.code);
};

/**
 * Fetch URL with timeout and exponential backoff retry.
 */
const fetchWithRetry = async (url, options = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          'User-Agent': getUserAgent(),
          Accept: 'text/html,application/json,text/plain,*/*',
          Referer: 'https://erail.in/trains-between-stations.aspx',
          ...options.headers,
        },
        validateStatus: (status) => status >= 200 && status < 400,
        ...options,
      });
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES && isRetryableError(error)) {
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

const normalizeTime = (value) => {
  if (!value || value === '--') return '--:--';
  const trimmed = String(value).trim();
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) return trimmed;
  const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{2})$/);
  if (dotMatch) return `${dotMatch[1].padStart(2, '0')}:${dotMatch[2]}`;
  return trimmed;
};

const normalizeDuration = (value) => {
  if (!value) return '--';
  const trimmed = String(value).trim();
  const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{2})$/);
  if (dotMatch) return `${dotMatch[1]}h ${dotMatch[2]}m`;
  return trimmed;
};

const inferTrainType = (name = '') => {
  const upper = name.toUpperCase();
  if (upper.includes('RAJDHANI')) return 'Rajdhani';
  if (upper.includes('SHATABDI')) return 'Shatabdi';
  if (upper.includes('DURONTO')) return 'Duronto';
  if (upper.includes('PASSENGER') || upper.includes('PASS')) return 'Passenger';
  if (upper.includes('SF') || upper.includes('EXPRESS') || upper.includes('EXP')) return 'Express';
  return 'Train';
};

/**
 * Parse eRail tilde-delimited between-stations payload.
 */
const parseErailDelimited = (rawData, fromCode, toCode) => {
  if (!rawData || typeof rawData !== 'string') return [];
  if (/please try again/i.test(rawData) || rawData.length < 50) return [];

  const trainsRaw = rawData.split('^').slice(1);
  return trainsRaw
    .map((segment) => {
      const fields = segment.split('~');
      if (fields.length < 13 || !/^\d{4,5}$/.test(fields[0])) return null;

      return {
        trainNumber: fields[0],
        trainName: fields[1],
        fromStation: fields[6] || fields[2] || fromCode,
        fromCode: fields[7] || fields[3] || fromCode,
        toStation: fields[8] || fields[4] || toCode,
        toCode: fields[9] || fields[5] || toCode,
        departureTime: normalizeTime(fields[10]),
        arrivalTime: normalizeTime(fields[11]),
        duration: normalizeDuration(fields[12]),
        type: inferTrainType(fields[1]),
        source: 'erail',
      };
    })
    .filter(Boolean);
};

/**
 * Cheerio HTML table parser for railway listing pages (fallback).
 */
const parseHtmlTrainTable = (html, fromCode, toCode) => {
  const $ = cheerio.load(html);
  const trains = [];

  $('table tr, .train-list tr, [class*="train"] tr').each((_, row) => {
    const cells = $(row)
      .find('td, th')
      .map((__, cell) => $(cell).text().replace(/\s+/g, ' ').trim())
      .get()
      .filter(Boolean);

    if (cells.length < 4) return;

    const rowText = cells.join(' ');
    const numberMatch = rowText.match(/\b(\d{5})\b/);
    if (!numberMatch) return;

    const timeMatches = rowText.match(/\b\d{1,2}[:.]\d{2}\b/g) || [];
    const nameCell = cells.find((c) => !/^\d{5}$/.test(c) && !/\d{1,2}[:.]\d{2}/.test(c)) || cells[1];

    trains.push({
      trainNumber: numberMatch[1],
      trainName: nameCell || 'Train',
      fromStation: fromCode,
      fromCode,
      toStation: toCode,
      toCode,
      departureTime: normalizeTime(timeMatches[0]),
      arrivalTime: normalizeTime(timeMatches[1]),
      duration: cells.find((c) => /\d+h|\d+\.\d{2}/i.test(c)) || '--',
      type: inferTrainType(nameCell),
      source: 'html',
    });
  });

  const seen = new Set();
  return trains.filter((t) => {
    if (seen.has(t.trainNumber)) return false;
    seen.add(t.trainNumber);
    return true;
  });
};

/**
 * Primary: eRail public endpoint (same source used by erail.in UI).
 */
const scrapeErail = async (fromCode, toCode) => {
  const url =
    `https://erail.in/rail/getTrains.aspx?Station_From=${encodeURIComponent(fromCode)}` +
    `&Station_To=${encodeURIComponent(toCode)}&DataSource=0&Language=0&Cache=true`;

  const { data } = await fetchWithRetry(url);
  const raw = String(data);

  if (raw.trim().startsWith('<')) {
    return parseHtmlTrainTable(raw, fromCode, toCode);
  }
  return parseErailDelimited(raw, fromCode, toCode);
};

/**
 * Secondary: scrape RailYatri page HTML with cheerio (embedded JSON / tables when present).
 */
const scrapeRailYatri = async (fromCode, toCode) => {
  const url = `https://www.railyatri.in/trains-between-stations?from_station=${fromCode}&to_station=${toCode}`;
  const { data } = await fetchWithRetry(url, {
    headers: { Referer: 'https://www.railyatri.in/' },
  });
  const html = String(data);

  const nextData = cheerio.load(html)('#__NEXT_DATA__').html();
  if (nextData) {
    try {
      const parsed = JSON.parse(nextData);
      const jsonStr = JSON.stringify(parsed.props?.pageProps || {});
      const matches = [...jsonStr.matchAll(/"train_number"\s*:\s*"(\d{5})"[\s\S]*?"train_name"\s*:\s*"([^"]+)"/g)];
      if (matches.length) {
        return matches.map((m) => ({
          trainNumber: m[1],
          trainName: m[2],
          fromStation: fromCode,
          fromCode,
          toStation: toCode,
          toCode,
          departureTime: '--:--',
          arrivalTime: '--:--',
          duration: '--',
          type: inferTrainType(m[2]),
          source: 'railyatri',
        }));
      }
    } catch {
      /* fall through to table parser */
    }
  }

  return parseHtmlTrainTable(html, fromCode, toCode);
};

const buildEmptyResponse = (fromCode, toCode, message) => ({
  success: true,
  from: fromCode,
  to: toCode,
  count: 0,
  trains: [],
  message: message || 'No trains found for this route.',
  fetchedAt: new Date().toISOString(),
});

const buildSuccessResponse = (fromCode, toCode, trains, source) => ({
  success: true,
  from: fromCode,
  to: toCode,
  count: trains.length,
  trains,
  source,
  fetchedAt: new Date().toISOString(),
});

/**
 * Get trains between two station codes with retries and multi-source fallback.
 */
const getTrainsBetweenStations = async (from, to) => {
  const fromCode = String(from).trim().toUpperCase();
  const toCode = String(to).trim().toUpperCase();

  const providers = [
    { name: 'erail', fn: () => scrapeErail(fromCode, toCode) },
    { name: 'railyatri', fn: () => scrapeRailYatri(fromCode, toCode) },
  ];

  const errors = [];

  for (const provider of providers) {
    try {
      const trains = await provider.fn();
      if (trains.length > 0) {
        return buildSuccessResponse(fromCode, toCode, trains, provider.name);
      }
    } catch (error) {
      errors.push(`${provider.name}: ${error.message}`);
      console.warn(`Between-stations scraper (${provider.name}) failed:`, error.message);
    }
  }

  if (errors.length) {
    console.warn('All between-stations providers failed:', errors.join(' | '));
  }

  return buildEmptyResponse(
    fromCode,
    toCode,
    errors.length
      ? 'Unable to fetch live train data right now. Please try again shortly.'
      : 'No trains found for this route.'
  );
};

module.exports = {
  getTrainsBetweenStations,
  fetchWithRetry,
  parseErailDelimited,
  parseHtmlTrainTable,
};
