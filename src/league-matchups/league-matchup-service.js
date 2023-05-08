const yahooApi = require('../yahoo-api/fantasy-baseball-api');


const testSomeShit = async (user, leagueId) => {

    const leagueSettings = await yahooApi.yfbb.getLeagueSettings(user, leagueId);
    const statCategoryInfo = leagueSettings.settings.stat_categories.stats.stat;
    const teamId = 6;
    const currentWeek = await yahooApi.yfbb.getCurrentWeek(user, leagueId);

    const mySchedule = await yahooApi.yfbb.getTeamMatchups(user, leagueId, teamId)
    // const nextWeeksMatchup = mySchedule.find(w => parseInt(w.week) === parseInt(currentWeek + 1))
    // const nextWeeksOpponent = nextWeeksMatchup.teams.team.find(t => parseInt(t.team_id) !== parseInt(teamId));
    // const nextWeeksOpponentId = nextWeeksOpponent.team_id;



    const leagueSeasonStats = await yahooApi.yfbb.getLeagueSeasonStats(user, leagueId);

    const matchups = await yahooApi.yfbb.getMyScoreboard(user, leagueId, currentWeek)

    const myMatchup = matchups.find(m => m.teams.team.some(t => t.team_id == teamId)); //compares sting to int (ToDo parse)
    leagueSeasonStats.current_matchup = myMatchup;

    let myMatchupTeamIds = myMatchup.teams.team.map(t => parseInt(t.team_id));
    console.log(myMatchupTeamIds)

    // myMatchupTeamIds = [5,9]
    const includeNextWeeksMatchup = true;
    if (includeNextWeeksMatchup) {
        // myMatchupTeamIds.push(parseInt(nextWeeksOpponentId))
    }


    for (let i = 0; i < leagueSeasonStats.standings.teams.team.length; i++) {
        // if (i === 1) break;
        const team = leagueSeasonStats.standings.teams.team[i];
        assignStatDetailsToStats(team.team_stats.stats.stat, statCategoryInfo);

        //get week by week stats
        const statsByWeek = [];
        const onlyGetCurrentOpponentWeeklyStats = true; // populate week by week stats for entire league??
        if (onlyGetCurrentOpponentWeeklyStats && (myMatchupTeamIds.includes(parseInt(team.team_id)))) {
            for (let j = currentWeek - 1; j > currentWeek - 4; j--) {
                const weekStats = await yahooApi.yfbb.getWeeklyStats(user, leagueId, team.team_id, j);
                assignStatDetailsToStats(weekStats, statCategoryInfo);
                statsByWeek.push({ week: j, stats: weekStats });
            }
            team.stats_by_week = statsByWeek;
        }
    }


    return leagueSeasonStats

}

const assignStatDetailsToStats = (stats, statCategoryInfo) => {
    for (let k = 0; k < stats.length; k++) {
        let stat = stats[k];
        const statDetails = statCategoryInfo.find(sci => sci.stat_id === stat.stat_id);
        stat = { ...stat, ...statDetails };
        stats[k] = stat;
    }
}



module.exports = { testSomeShit }