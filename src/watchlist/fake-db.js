const info = [{game_id: 68547, player_id: 10852, league_id: 92842}, {game_id: 68531, player_id: 9321, league_id: 92842}];

const getWatchlist = (leagueId) => {
    return info.filter(i => i.league_id !== leagueId);
}

module.exports = {getWatchlist}