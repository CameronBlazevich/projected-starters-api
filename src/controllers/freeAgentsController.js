const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');

router.get('/:foo/:bar', (req, res) => {
  const fooValue = req.params.foo;
  const barValue = req.params.bar;
  // check if the cached data is available
  const teamStats = cacheManager.getFromCache('team-stats');
  const projectedLineups = cacheManager.getFromCache('projected-lineups');
  if (teamStats) {
    // use the cached data to get free agents

    res.send(
      `Free agents for foo=${fooValue} and bar=${barValue}: Team Stats: ${JSON.stringify(
        teamStats
      )} and Projected Lineups: ${JSON.stringify(projectedLineups)}`
    );
  } else {
    res.send('Data not available. Please try again later.');
  }
});

module.exports = router;
