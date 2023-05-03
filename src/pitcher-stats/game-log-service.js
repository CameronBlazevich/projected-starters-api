const axios = require('axios');

const getGameLog = async (yahooPitcherId) => {
    const url = `https://graphite-secure.sports.yahoo.com/v1/query/shangrila/gameLogBaseballPitching`
    const query = `?lang=en-US&region=US&tz=America/New_York&ysp_redesign=1&ysp_platform=desktop&playerId=mlb.p.${yahooPitcherId}&season=2023&seasonPhase=REGULAR_SEASON`

    try {
        const response = await axios.get(`${url}${query}`);
        const mapped = mapResponse(response.data);
        return mapped;
    } catch (err) {
        console.error(err);
    }

}

module.exports = { getGameLog }

const mapResponse = (gameLogResponse) => {
    const player = gameLogResponse.data.players?.[0];
    if (!player) {
        console.log(`No player returned for game log request.`)
        return {};
    }

    const gameStats = player.playerGameStats.map(gameStats => {
        const game = gameStats.game;
        const thisPlayersTeamId = gameStats.teamId;
        const homeTeamId = game.homeTeamId;
        const awayTeamid = game.awayTeamid;
        const isPitcherHome = thisPlayersTeamId === homeTeamId;

        const didHomeTeamScoreMore = (game.homeScore > game.awayScore);
        const didThisPlayersTeamWin = isPitcherHome && didHomeTeamScoreMore ? true : isPitcherHome ? false : true;

        
        const stats = gameStats.stats;
        const mapped = {
            date: game.startTime,
            opponent: `${isPitcherHome ? '' : '@'}${game.teams.find(team => team.teamId !== thisPlayersTeamId).abbreviation}`,
            score: `${didThisPlayersTeamWin ? 'W' : 'L'} ${game.awayScore}-${game.homeScore}`,
            stats: {
                decision: getStatValueFromResponse(stats, 'DECISION'),
                innings_pitched: getStatValueFromResponse(stats, 'INNINGS_PITCHED'),
                hits: getStatValueFromResponse(stats, 'HITS_ALLOWED'),
                runs: getStatValueFromResponse(stats, 'RUNS_ALLOWED'),
                earned_runs: getStatValueFromResponse(stats, 'EARNED_RUNS'),
                walks: getStatValueFromResponse(stats, 'WALKS_ALLOWED'),
                strikeouts: getStatValueFromResponse(stats, 'STRIKEOUTS_THROWN'),
                homeruns: getStatValueFromResponse(stats, 'HOME_RUNS_ALLOWED'),
                era: getStatValueFromResponse(stats, 'ERA'),
                whip: getStatValueFromResponse(stats, 'WHIP'),
                baa: getStatValueFromResponse(stats, 'BATTING_AVERAGE_AGAINST')
            }
        };

        return mapped;
    })

    return gameStats;
}


const getStatValueFromResponse = (stats, statId) => {
    const stat = stats.find(s => s.statId === statId).value;
    return stat;
}