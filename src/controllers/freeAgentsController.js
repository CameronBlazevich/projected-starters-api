const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');

router.get('/:foo/:bar', (req, res) => {
  const fooValue = req.params.foo;
  const barValue = req.params.bar;
  // check if the cached data is available
  const cachedData = cacheManager.getFromCache('team-stats');
  if (cachedData) {
    // use the cached data to get free agents
    const freeAgents = cachedData;
    res.send(
      `Free agents for foo=${fooValue} and bar=${barValue}: ${freeAgents}`
    );
  } else {
    res.send('Data not available. Please try again later.');
  }
});

module.exports = router;
