const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');
const {
  combineMatchupsAndFreeAgents,
} = require('../mappers/combine-fas-with-projected-starters');
const { mapFACollection } = require('../mappers/map-yahoo-fa-to-dto');
const yahooApi = require('../yahoo-api/fantasy-baseball-api');
const auth = require('../request-handling/middleware')

router.get('/:leagueId', auth, async (req, res) => {
  const leagueId = req.params.leagueId;
  // check if the cached data is available
  const teamStats = cacheManager.getFromCache('team-stats');
  const projectedLineups = cacheManager.getFromCache('projected-lineups');

  //  console.log(`USER FROM TOKEN: ${JSON.stringify(req.user)}`)

  //temp
  try {
    yahooApi.yfbb.WEEK = await yahooApi.yfbb.getCurrentWeek(req.user);
  } catch (err) {
    return res.status(400).send("Couldn't authenticate with Yahoo")
  }

  const freeAgents = await yahooApi.yfbb.getFreeAgents(req.user, leagueId);

  const freeAgentsDTO = mapFACollection(freeAgents);

  const combined = combineMatchupsAndFreeAgents(
    projectedLineups,
    freeAgentsDTO,
    teamStats
  );

  if (combined) {
    res.send(
      combined
      // `Free agents for foo=${fooValue} and bar=${barValue}: FreeAgents: ${JSON.stringify(
      //   freeAgentsDTO
      // )} Team Stats: ${JSON.stringify(
      //   teamStats
      // )} and Projected Lineups: ${JSON.stringify(projectedLineups)}`
      //   `Free agents that are starting: ${JSON.stringify(
      //     combined
      //   )}. Team Stats: ${JSON.stringify(teamStats)}`
    );
  } else {
    res.send('Data not available. Please try again later.');
  }
});

module.exports = router;
