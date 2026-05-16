const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // Default 1 hour TTL

module.exports = cache;
