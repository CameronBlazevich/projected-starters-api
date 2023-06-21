const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');
const {hydrateMatchupsWithTeamStats} = require('../mappers/combine-fas-with-projected-starters');
const { getIdsForRosteredPlayers, getRosteredPlayers } = require('../roster/roster-service');
const auth = require('../request-handling/middleware');


router.get("/:leagueId/:teamId", auth, async (req, res) => {
    try {
        const leagueId = req.params.leagueId;
        const teamId = req.params.teamId;

        const user = req.user;

        
        const rosteredPlayers =  await getRosteredPlayers(user.user_id, leagueId, teamId)
        
        const playerNames = rosteredPlayers.map(p => p.name.full.normalize().toLowerCase());

        const projectedLineups = cacheManager.getFromCache('projected-lineups');
        const teamStats = cacheManager.getFromCache('team-stats');

        hydrateMatchupsWithTeamStats(projectedLineups, teamStats);

        const thisWeeksMatchups = [];

        for (let i=0; i < projectedLineups.length; i++) {
            const dayOfGames = projectedLineups[i];
            const todaysMatchups = [];
            for (let j=0; j< dayOfGames.games.length; j++) {
                const game = dayOfGames.games[j];

                const homeBattingOrder = game.homeBattingOrder;
                const awayBattingOrder = game.awayBattingOrder;

                const rosteredPlayersInHomeBattingOrder = homeBattingOrder.filter(hitter => playerNames.includes(hitter.Player.Name.normalize().toLowerCase()))
                rosteredPlayersInHomeBattingOrder.forEach(hitter => {
                    const matchup = {pitcher: game.awayPitcher, hitter}
                    todaysMatchups.push(matchup);
                })

                const rosteredPlayersInAwayBattingOrder = awayBattingOrder.filter(hitter => playerNames.includes(hitter.Player.Name.normalize().toLowerCase()))
                rosteredPlayersInAwayBattingOrder.forEach(hitter => {
                    const matchup = {pitcher: game.homePitcher, hitter}
                    todaysMatchups.push(matchup);
                })
            }
            thisWeeksMatchups.push({date: dayOfGames.date, matchups: todaysMatchups})
        }

        return res.status(200).json(thisWeeksMatchups);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;