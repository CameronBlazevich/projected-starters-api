const { getMlbIdFromYahooName, getMlbIdsFromYahooIds } = require("../database/player-id-lookup");
const { getMlbComTeamIdOrDefault } = require("../team-ids/team-id-mapper");
const { getMatchups } = require("./matchup-service-client");



const getPitcherHitterMatchups = async (request) => {
    const { pitcherName, pitcherTeam, lineup, hittingTeam } = request;

    const hittingTeamId = getMlbComTeamIdOrDefault(hittingTeam);
    const pitchingTeamId = getMlbComTeamIdOrDefault(pitcherTeam);
    const mlbPitcherId = await getMlbIdFromYahooName(pitcherName);
    const matchupResults = await getMatchups(mlbPitcherId, hittingTeamId, pitchingTeamId);

    for (let i = 0; i < matchupResults.length; i++) {
        if (matchupResults[i].Player) {
            const firstName = matchupResults[i].Player.split(', ')[1];
            const lastName = matchupResults[i].Player.split(', ')[0];
            matchupResults[i].originalName = `${firstName} ${lastName}`;
        }
    }

    return matchupResults;
}


module.exports = { getPitcherHitterMatchups }