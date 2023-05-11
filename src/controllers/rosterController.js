const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { getRosteredPlayerProjections, getRosteredPlayers } = require('../roster/roster-service');
const { createErrorResponse } = require('./responses/error-response')


router.get("/getProjectedStarters/:leagueId/:teamId", auth, async (req, res) => {
    const leagueId = req.params.leagueId;
    const teamId = req.params.teamId;
    if (!leagueId) {
        return res.status(400).json({ error: "LeagueId is required." })
    }

    if (!teamId) {
        return res.status(400).json({ error: "teamId is required." })
    }

    const user = req.user;
    try {
        const result = await getRosteredPlayerProjections(user.user_id, leagueId, teamId)

        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
})

router.get("/getRoster/:leagueId/:teamId", auth, async (req, res) => {
    if (!req.params.leagueId) {
        return res.status(400).send("No leagueId in request")
    }
    // if (!req.params.teamId) {
    //     return res.status(400).send("No teamId in request")
    // }

    const user = req.user;
    try {
        const result = await getRosteredPlayers(user.user_id, req.params.leagueId)
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
})

module.exports = router;