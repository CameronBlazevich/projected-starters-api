const json = [
  {
    player_key: '422.p.9586',
    player_id: '9586',
    name: {
      full: 'Andrew Heaney',
      first: 'Andrew',
      last: 'Heaney',
      ascii_first: 'Andrew',
      ascii_last: 'Heaney',
    },
    url: 'https://sports.yahoo.com/mlb/players/9586',
    editorial_player_key: 'mlb.p.9586',
    editorial_team_key: 'mlb.t.13',
    editorial_team_full_name: 'Texas Rangers',
    editorial_team_abbr: 'TEX',
    editorial_team_url: 'https://sports.yahoo.com/mlb/teams/texas/',
    is_keeper: { status: {}, cost: {}, kept: {} },
    uniform_number: '44',
    display_position: 'SP',
    headshot: {
      url: 'https://s.yimg.com/iu/api/res/1.2/oH._XBYr1NZIHvmGydWJxQ--~C/YXBwaWQ9eXNwb3J0cztjaD0yMzM2O2NyPTE7Y3c9MTc5MDtkeD04NTc7ZHk9MDtmaT11bGNyb3A7aD02MDtxPTEwMDt3PTQ2/https://s.yimg.com/xe/i/us/sp/v/mlb_cutout/players_l/03172023/9586.png',
      size: 'small',
    },
    image_url:
      'https://s.yimg.com/iu/api/res/1.2/oH._XBYr1NZIHvmGydWJxQ--~C/YXBwaWQ9eXNwb3J0cztjaD0yMzM2O2NyPTE7Y3c9MTc5MDtkeD04NTc7ZHk9MDtmaT11bGNyb3A7aD02MDtxPTEwMDt3PTQ2/https://s.yimg.com/xe/i/us/sp/v/mlb_cutout/players_l/03172023/9586.png',
    is_undroppable: '0',
    position_type: 'P',
    primary_position: 'SP',
    eligible_positions: { position: ['SP', 'P'] },
    has_player_notes: '1',
    player_notes_last_timestamp: '1680675774',
  },
  {
    player_key: '422.p.9872',
    player_id: '9872',
    name: {
      full: 'José Berríos',
      first: 'José',
      last: 'Berríos',
      ascii_first: 'José',
      ascii_last: 'Berríos',
    },
    url: 'https://sports.yahoo.com/mlb/players/9872',
    editorial_player_key: 'mlb.p.9872',
    editorial_team_key: 'mlb.t.14',
    editorial_team_full_name: 'Toronto Blue Jays',
    editorial_team_abbr: 'TOR',
    editorial_team_url: 'https://sports.yahoo.com/mlb/teams/toronto/',
    is_keeper: { status: {}, cost: {}, kept: {} },
    uniform_number: '17',
    display_position: 'SP',
    headshot: {
      url: 'https://s.yimg.com/iu/api/res/1.2/kQZm45iideV2B.8497zpfQ--~C/YXBwaWQ9eXNwb3J0cztjaD0yMzM2O2NyPTE7Y3c9MTc5MDtkeD04NTc7ZHk9MDtmaT11bGNyb3A7aD02MDtxPTEwMDt3PTQ2/https://s.yimg.com/xe/i/us/sp/v/mlb_cutout/players_l/03162023/9872.png',
      size: 'small',
    },
    image_url:
      'https://s.yimg.com/iu/api/res/1.2/kQZm45iideV2B.8497zpfQ--~C/YXBwaWQ9eXNwb3J0cztjaD0yMzM2O2NyPTE7Y3c9MTc5MDtkeD04NTc7ZHk9MDtmaT11bGNyb3A7aD02MDtxPTEwMDt3PTQ2/https://s.yimg.com/xe/i/us/sp/v/mlb_cutout/players_l/03162023/9872.png',
    is_undroppable: '0',
    position_type: 'P',
    primary_position: 'SP',
    eligible_positions: { position: ['SP', 'P'] },
    has_player_notes: '1',
    player_notes_last_timestamp: '1680586170',
  },
];

function mapFA(yahooFA) {
  const mapped = {
    name: yahooFA.name,
    team: yahooFA.editorial_team_abbr,
    playerUrl: yahooFA.url,
    playerId: yahooFA.player_id,
    eligiblePositions: yahooFA.eligible_positions,
    // headshot: yahooFA.headshot,
  };

  return mapped;
}

function mapFACollection(yahooFAs) {
  const mapped = yahooFAs.map((fa) => mapFA(fa));
  return mapped;
}

module.exports = { mapFACollection };
