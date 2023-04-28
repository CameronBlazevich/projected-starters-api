const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { getPitcherHitterMatchups } = require('../pitcher-hitter-matchups/pitcher-hitter-matchups-service');

router.post('/', auth, async (req, res) => {
    const pitcherName = req.body.pitcherName;
    const pitcherTeam = req.body.pitcherTeamAbbr;
    const lineup = req.body.hittingLineup;
    const hittingTeam = req.body.hittingTeamAbbr;

    const request = {pitcherName, pitcherTeam, lineup, hittingTeam};




    const result = await getPitcherHitterMatchups(request)

    return res.status(200).json(result);
}
)

module.exports = router;
