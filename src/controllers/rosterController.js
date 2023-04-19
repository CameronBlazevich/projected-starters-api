const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const {getRosteredPlayerProjections, getRosteredPlayers} = require('../roster/roster-service');




// router.get("/getProjectedStarters/:leagueId", auth, async (req, res) => {
router.get("/getProjectedStarters/:leagueId/:teamId", auth, async (req, res) => {
    const leagueId = req.params.leagueId;
    const teamId = req.params.teamId;
    if (!leagueId) {
        return res.status(400).json({error: "LeagueId is required."})
    }

    if (!teamId) {
        return res.status(400).json({error: "teamId is required."})
    }

    const user = req.user;
    try {
        const result = await getRosteredPlayerProjections(user, leagueId, teamId)
        
        return res.status(200).json(result);
    } catch (err) {
        if (err.message?.includes("401")) {
            return res.status(400).json({error: "Yahoo authentication failure"})
        }
        return res.status(500).json({ error: "Something went wrong" })
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
    const result = await getRosteredPlayers(user, req.params.leagueId)
    return res.status(200).json(result);
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;