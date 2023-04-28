const mlbTeamIds =  [
    {teamId: 108, teamAbbr:  "LAA", teamName: "Angels"}
    ,{teamId: 117, teamAbbr:  "HOU", teamName: "Astros"}
    ,{teamId: 133, teamAbbr:  "OAK", teamName: "Athletics"}
    ,{teamId: 141, teamAbbr:  "TOR", teamName: "Blue Jays"}
    ,{teamId: 144, teamAbbr:  "ATL", teamName: "Braves"}
    ,{teamId: 158, teamAbbr:  "MIL", teamName: "Brewers"}
    ,{teamId: 138, teamAbbr:  "STL", teamName: "Cardinals"}
    ,{teamId: 112, teamAbbr:  "CHC", teamName: "Cubs"}
    ,{teamId: 109, teamAbbr:  "AZ", teamName: "D-backs"}
    ,{teamId: 119, teamAbbr:  "LAD", teamName: "Dodgers"}
    ,{teamId: 137, teamAbbr:  "SF", teamName: "Giants"}
    ,{teamId: 114, teamAbbr:  "CLE", teamName: "Guardians"}
    ,{teamId: 136, teamAbbr:  "SEA", teamName: "Mariners"}
    ,{teamId: 146, teamAbbr:  "MIA", teamName: "Marlins"}
    ,{teamId: 121, teamAbbr:  "NYM", teamName: "Mets"}
    ,{teamId: 120, teamAbbr:  "WSH", teamName: "Nationals"}
    ,{teamId: 110, teamAbbr:  "BAL", teamName: "Orioles"}
    ,{teamId: 135, teamAbbr:  "SD", teamName: "Padres"}
    ,{teamId: 143, teamAbbr:  "PHI", teamName: "Phillies"}
    ,{teamId: 134, teamAbbr:  "PIT", teamName: "Pirates"}
    ,{teamId: 140, teamAbbr:  "TEX", teamName: "Rangers"}
    ,{teamId: 139, teamAbbr:  "TB", teamName: "Rays"}
    ,{teamId: 113, teamAbbr:  "CIN", teamName: "Reds"}
    ,{teamId: 111, teamAbbr:  "BOS", teamName: "Red Sox"}
    ,{teamId: 115, teamAbbr:  "COL", teamName: "Rockies"}
    ,{teamId: 118, teamAbbr:  "KC", teamName: "Royals"}
    ,{teamId: 116, teamAbbr:  "DET", teamName: "Tigers"}
    ,{teamId: 142, teamAbbr:  "MIN", teamName: "Twins"}
    ,{teamId: 145, teamAbbr:  "CWS", teamName: "White Sox"}
    ,{teamId: 147, teamAbbr:  "NYY", teamName: "Yankees"}
    ];
    
     const getMlbComTeamIdOrDefault = (teamAbbr) => {
        return mlbTeamIds.find(t => t.teamAbbr === teamAbbr)?.teamId;
    }

    module.exports = { getMlbComTeamIdOrDefault}
    