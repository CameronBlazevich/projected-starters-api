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
  const teamStats = cacheManager.getFromCache('team-stats');
  const projectedLineups = cacheManager.getFromCache('projected-lineups');

  try {
    yahooApi.yfbb.WEEK = await yahooApi.yfbb.getCurrentWeek(req.user);
  } catch (err) {
    if (err.message?.includes("401")) {
      return res.status(400).json({error: "Yahoo authentication failure"})
    }
    return res.status(500).json({ error: "Something went wrong" })
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
    );
  } else {
    res.send('Data not available. Please try again later.');
  }
});

module.exports = router;
