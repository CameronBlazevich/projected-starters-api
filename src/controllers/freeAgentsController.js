const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { getFreeAgentsWithMatchupInfo } = require('../free-agents/free-agents-service');
const { createErrorResponse } = require('./responses/error-response');

router.get('/:leagueId', auth, async (req, res) => {
  const leagueId = req.params.leagueId;

  try {
    const result = await getFreeAgentsWithMatchupInfo(req.user.user_id, leagueId);
    return res.status(200).json(result);
  } catch (err) {
    return createErrorResponse(res, err);
  }
});

module.exports = router;
