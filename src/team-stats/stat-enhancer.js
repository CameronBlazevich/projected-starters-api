const rawStatsExample = [
  { teamAbbr: 'TB', runsScored: 44, strikeouts: 44, onBasePercent: '.348' },
  { teamAbbr: 'BOS', runsScored: 41, strikeouts: 48, onBasePercent: '.335' },
  { teamAbbr: 'CLE', runsScored: 38, strikeouts: 54, onBasePercent: '.334' },
  { teamAbbr: 'LAD', runsScored: 38, strikeouts: 59, onBasePercent: '.371' },
];

function addRankings(arr) {
  const sortedByRuns = [...arr].sort((a, b) => b.runsScored - a.runsScored);
  const sortedByStrikeouts = [...arr].sort(
    (a, b) => b.strikeouts - a.strikeouts
  );

  const rankings = sortedByRuns.map((item, index) => {
    const itemWithRunsRank = { ...item, runsRank: index + 1 };
    const matchingItem = sortedByStrikeouts.find(
      (element) => element.teamAbbr === item.teamAbbr
    );
    const strikeoutsRank = sortedByStrikeouts.indexOf(matchingItem) + 1;
    return { ...itemWithRunsRank, strikeoutsRank };
  });

  return rankings;
}

function enhance(teamStats) {
  const enhanced = addRankings(teamStats);
  return enhanced;
}

module.exports = { enhance };
