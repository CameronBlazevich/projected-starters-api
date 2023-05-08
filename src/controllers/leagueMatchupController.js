const express = require('express');
const auth = require('../request-handling/middleware')
const { testSomeShit } = require('../league-matchups/league-matchup-service');
const router = express.Router();

router.get("/:leagueId", auth, async (req, res) => {
    try {
        const leagueId = req.params.leagueId;
        const teamStats = await testSomeShit(req.user, leagueId )
        return res.status(200).json(teamStats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;