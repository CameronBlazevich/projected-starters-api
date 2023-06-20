const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { getRosteredPlayerProjections, getRosteredPlayersWithStats, scheduleAddDrop, removeScheduledAddDrop, getScheduledAddDrops } = require('../roster/roster-service');
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
    if (!req.params.teamId) {
        return res.status(400).send("No teamId in request")
    }

    const user = req.user;
    try {
        const result = await getRosteredPlayersWithStats(user.user_id, req.params.leagueId, req.params.teamId)
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
})

router.get("/scheduleAddDrops/:leagueId/:teamId", auth, async (req, res) => {
    if (!req.params.leagueId) {
        return res.status(400).send("No leagueId in request")
    }
    if (!req.params.teamId) {
        return res.status(400).send("No teamId in request")
    }

    const user = req.user;
    try {
        const result = await getScheduledAddDrops(user.user_id, req.params.leagueId, req.params.teamId)
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
})

router.post('/scheduleAddDrop', auth, async (req, res) => {
    const addPlayerId = req.body.addPlayerId;
    const dropPlayerId = req.body.dropPlayerId;
    const leagueId = req.body.leagueId;
    const teamId = req.body.teamId;
    const earliestAddTimeUtc = req.body.earliestAddTimeUtc;

    if (!addPlayerId || !dropPlayerId || !leagueId || !teamId || !earliestAddTimeUtc) {
        // ToDo: real validation
        return createErrorResponse(res, "Missing some args...")
    }

    const user = req.user;

    const request = { userId: user.user_id, addPlayerId, dropPlayerId, leagueId, teamId, earliestAddTimeUtc };
    try {
        const result = await scheduleAddDrop(request);
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
}
)

router.post('/removeScheduledAddDrop', auth, async (req, res) => {
    const addPlayerId = req.body.addPlayerId;
    const dropPlayerId = req.body.dropPlayerId;
    const leagueId = req.body.leagueId;
    const teamId = req.body.teamId;


    if (!addPlayerId || !dropPlayerId || !leagueId || !teamId) {
        // ToDo: real validation
        return createErrorResponse(res, "Missing some args...")
    }
    
    const user = req.user;

    const request = { userId: user.user_id, addPlayerId, dropPlayerId, leagueId, teamId };
    try {
        const result = await removeScheduledAddDrop(request);
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
}
)

module.exports = router;