const rawStatsExample = [
  { teamAbbr: 'TB', runsScored: 44, strikeouts: 44, onBasePercent: '.348' },
  { teamAbbr: 'BOS', runsScored: 41, strikeouts: 48, onBasePercent: '.335' },
  { teamAbbr: 'CLE', runsScored: 38, strikeouts: 54, onBasePercent: '.334' },
  { teamAbbr: 'LAD', runsScored: 38, strikeouts: 59, onBasePercent: '.371' },
];

function addRankings(arr) {
  const sortedByRuns = [...arr].sort((a, b) => b.runsScored - a.runsScored);

  for (let i = 0; i < sortedByRuns.length; i++) {
    sortedByRuns[i].runsRank = i + 1;
  }

  const sortedByStrikeouts = [...sortedByRuns].sort(
    (a, b) => b.strikeouts - a.strikeouts
  );

  for (let i = 0; i < sortedByStrikeouts.length; i++) {
    sortedByStrikeouts[i].strikeoutsRank = i + 1;
  }

  return sortedByStrikeouts;
}

function enhance(teamStats) {
  const enhanced = addRankings(teamStats);
  return enhanced;
}

module.exports = { enhance };
