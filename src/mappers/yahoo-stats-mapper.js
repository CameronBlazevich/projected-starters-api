const addKnownAdvancedStats = (statIds) => {
    const knownStats = [
        {
            "stat_id": '1030', "display_name": "SLG", "name": "Slugging %", "sort_order": '1', "position_types": {
                "position_type": "P"
            }
        },
        {
            "stat_id": '1031', "display_name": "BAPIP", "name": "BAPIP", "sort_order": '1', "position_types": {
                "position_type": "P"
            }
        },
        {
            "stat_id": '1018', "display_name": "P/IP", "name": "Pitcher / Innings Pitched", "sort_order": '1', "position_types": {
                "position_type": "P"
            }
        },
        {
            "stat_id": '1029', "display_name": "OBP", "name": "On-Base %", "sort_order": '1', "position_types": {
                "position_type": "P"
            }
        },
        {
            "stat_id": '1028', "display_name": "BAA", "name": "Batting Avg Against", "sort_order": '1', "position_types": {
                "position_type": "P"
            }
        },
        {
            "stat_id": '1032', "display_name": "FIP", "name": "Fielding Independent Pitching", "sort_order": '1', "position_types": {
                "position_type": "P"
            }
        },
    ];
    statIds.stat.push(...knownStats)
}


const mapStatsOntoPlayers = (players, statKeyInfo) => {
    const statToAdd = {}
    for (let i = 0; i < players.length; i++) {
        const playerStats = players[i].player_stats.stats.stat;
        for (let j = 0; j < playerStats.length; j++) {
            const currentStat = playerStats[j];
            const statInfo = getStatInfo(statKeyInfo, currentStat.stat_id);
            if (statInfo) {
                currentStat.name = statInfo.name;
                currentStat.display_name = statInfo.display_name;
                currentStat.sort_order = statInfo.sort_order;
                currentStat.position_types = statInfo.position_types;
            }
        }


        const playerAdvancedStats = players[i].player_advanced_stats.stats.stat;
        for (let j = 0; j < playerAdvancedStats.length; j++) {
            const currentStat = playerAdvancedStats[j];
            const statInfo = getStatInfo(statKeyInfo, currentStat.stat_id);
            if (statInfo) {
                currentStat.name = statInfo.name;
                currentStat.display_name = statInfo.display_name;
                currentStat.sort_order = statInfo.sort_order;
                currentStat.position_types = statInfo.position_types;

                // add this as it's own stat to the regular stat collection to make iterating easier ont he client
                // const statToAdd = {
                //     stat_id: statInfo.stat_id,
                //     name: statInfo.name,
                //     display_name: statInfo.display_name,
                //     sort_order: statInfo.sort_order,
                //     position_types: statInfo.position_types,
                //     value: stat
                // };

                // playerStats.push(statToAdd);
            }
        }

    }
    return players;
}

const getStatInfo = (statInfo, statId) => {
    const info = statInfo.stat.find(si => si.stat_id === statId);
    if (info) {
        return info;
    } else {
        console.log(`no match for stat id ${statId}`)
        return null
    }
}

module.exports = { mapStatsOntoPlayers, addKnownAdvancedStats }