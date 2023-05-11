const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { getUserLeagues, createUserLeague, deleteUserLeague } = require('../database/user-leagues')
const { createErrorResponse } = require('./responses/error-response');


router.get("/getUserLeagues", auth, async (req, res) => {
    const user = req.user;
    try {
        const result = await getUserLeagues(user.user_id);
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
})

router.post("/createUserLeague", auth, async (req, res) => {

    if (!req.body.leagueId) {
        return res.status(400).send("No leagueId in request")
    }

    if (!req.body.leagueTypeId) {
        return res.status(400).send("No leagueTypeId in request")
    }


    const user = req.user;

    try {
        const result = await createUserLeague(user.user_id, req.body.leagueId, req.body.leagueTypeId)

        const mappedResult = mapToDto(result);

        return res.status(200).json(mappedResult);
    } catch (err) {
        return createErrorResponse(res, err);
    }
});

router.post("/deleteUserLeague", auth, async (req, res) => {

    if (!req.body.leagueId) {
        return res.status(400).send("No leagueId in request")
    }
    const user = req.user;

    try {
        const result = await deleteUserLeague(user.user_id, req.body.leagueId)
        const mapped = mapToDto(result);

        return res.status(200).json(mapped);
    } catch (err) {
        return createErrorResponse(res, err);
    }
});

const mapLeagues = (league) => {
    const mapped = { league_id: league.league_id, league_type_id: league.league_type_id, team_id: league.team_id };
    return mapped;
}

const mapToDto = (leagues) => {
    const mapped = leagues.map(league => mapLeagues(league));
    return mapped;
}

module.exports = router;