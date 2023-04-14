const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { storeAuthCode, getInfo, setLeagueId} = require('../database/user-yahoo-info');


router.post("/setCode", auth, async (req, res) => {

    if (!req.body.code) {
        return res.status(400).send("No code in request")
    }
    const user = req.user;
    const result = await storeAuthCode(user.user_id, req.body.code)

    return res.status(200).send("Auth code saved");
});

router.post("/setLeagueId", auth, async (req, res) => {

    if (!req.body.leagueId) {
        return res.status(400).send("No leagueId in request")
    }
    const user = req.user;
    const result = await setLeagueId(user.user_id, req.body.leagueId)

    return res.status(200).json({league_id: result.league_id});
});

router.get("/getYahooInfo", auth, async(req, res) => {
    const user = req.user;
    try {
    const result = await getInfo(user.user_id);
    return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({error:"Something went wrong"})
    }
})

module.exports = router;