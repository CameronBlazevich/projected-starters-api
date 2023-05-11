const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { createUserTeam } = require('../database/user-teams');
const { getUserLeagues } = require('../database/user-leagues');
const { createErrorResponse } = require('./responses/error-response')


router.post("/createUserTeam", auth, async (req, res) => {

    if (!req.body.leagueId) {
        return res.status(400).json({ message: "No leagueId in request" });
    }

    if (!req.body.teamId) {
        return res.status(400).json({ message: "No teamId in request" });
    }

    const user = req.user;

    try {
        await createUserTeam(user.user_id, req.body.leagueId, req.body.teamId);
        const userLeagues = await getUserLeagues(user.user_id);
        return res.status(200).json(userLeagues);
    } catch (err) {
        return createErrorResponse(res, err);
    }
});

module.exports = router;