const NodeCache = require('node-cache');
const cache = new NodeCache();

function setInCache(key, data, durationMs) {
  console.log(`Updating cache key: ${key}`);
  cache.set(key, data, durationMs);
}

function getFromCache(key) {
  console.log(`Retrieving from cache key: ${key}`);
  const cached = cache.get(key);
  return cached;
}

module.exports = { setInCache, getFromCache };
