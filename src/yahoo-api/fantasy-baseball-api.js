const credentialManager = require('../database/credentials');
const qs = require('qs');
const axios = require('axios');
const parser = require('xml2json');
const CONFIG = require('../../config.json');
const { getAuthCode } = require('../database/auth-code');

const USER_ID = 1;

function getAuthHeader() {
  const authHeader = Buffer.from(
    `${CONFIG.CONSUMER_KEY}:${CONFIG.CONSUMER_SECRET}`,
    `binary`
  ).toString(`base64`);

  return authHeader;
}

function getAuthEndpoint() {
  return `https://api.login.yahoo.com/oauth2/get_token`;
}

async function getInitialAuthorization(userAuthCode) {
  console.log(`GettingCreds`);
  return axios({
    url: getAuthEndpoint(),
    method: 'post',
    headers: {
      Authorization: `Basic ${getAuthHeader()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
    },
    data: qs.stringify({
      client_id: CONFIG.CONSUMER_KEY,
      client_secret: CONFIG.CONSUMER_SECRET,
      redirect_uri: 'oob',
      code: userAuthCode,
      grant_type: 'authorization_code',
    }),
  }).catch((err) => {
    console.error(`Error in getInitialAuthorization(): ${err}`);
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', err.message);
    }
    console.log(err.config);
  });
}

// Read the Yahoo OAuth credentials from the db
async function getCredentials(user) {
  try {
    console.log(`Inside getCredentials(): ${user.email}`)
    const credentials = await credentialManager.getCredentials(user.email);

    // console.log(`Found credentials in db: ${JSON.stringify(credentials)}`);

    return credentials;
    // Use the credentials to make API calls
    // ...
  } catch (err) {
    console.error(err);
    if (err.message.startsWith('Credentials not found')) {
      console.log('No creds found in db...');
      console.log('Does user have a YahooAuthCode?')
      const userAuthCode = await getAuthCode(user.email);
      console.log(`User Auth Code Found: ${JSON.stringify(userAuthCode)}`);

      const newToken = await getInitialAuthorization(userAuthCode.yahoo_auth_code);
      if (newToken && newToken.data && newToken.data.access_token) {
        const newCreds = await credentialManager.storeCredentials(
          user.user_id,
          newToken.data.access_token,
          newToken.data.refresh_token
        );

        return newCreds;
        // Use the new credentials to make API calls
        // ...
      }
    } else {
      console.error(`Error retrieving credentials for user ${userEmail}: ${err}`);
      process.exit();
    }
  }
}

exports.yfbb = {
  // Global week variable, start at 1
  WEEK: 1,

  // API endpoints
  YAHOO: `https://fantasysports.yahooapis.com/fantasy/v2`,
  gameKey() {
    return `${this.YAHOO}/game/mlb`;
  },
  freeAgents(i) {
    const startNum = typeof i !== 'number' || i < 0 || i > 20 ? 0 : i;
    const url = `${this.YAHOO}/league/${
      CONFIG.LEAGUE_KEY
    }/players;status=A;count=100;start=${startNum * 25};position=P;sort=OR`;
    console.log(url);
    return url;
  },
  myTeam() {
    return `${this.YAHOO}/team/${CONFIG.LEAGUE_KEY}.t.${CONFIG.TEAM}/roster/`;
  },
  myWeeklyStats() {
    return `${this.YAHOO}/team/${CONFIG.LEAGUE_KEY}.t.${CONFIG.TEAM}/stats;type=week;week=${this.WEEK}`;
  },
  scoreboard() {
    return `${this.YAHOO}/league/${CONFIG.LEAGUE_KEY}/scoreboard;week=${this.WEEK}`;
  },
  metadata() {
    return `${this.YAHOO}/league/${CONFIG.LEAGUE_KEY}/metadata`;
  },
  transactions() {
    return `${this.YAHOO}/league/${CONFIG.LEAGUE_KEY}/transactions;types=add,trade,drop`;
  },
  user() {
    return `${this.YAHOO}/users;use_login=1/games`;
  },
  statsID() {
    return `${this.YAHOO}/game/${CONFIG.LEAGUE_KEY.substr(
      0,
      3
    )}/stat_categories`;
  },
  roster() {
    return `${this.YAHOO}/team/${CONFIG.LEAGUE_KEY}.t.${CONFIG.TEAM}/roster/players`;
  },

  // If authorization token is stale, refresh it
  async refreshAuthorizationToken(token) {
    return await axios({
      url: getAuthEndpoint(),
      method: 'post',
      headers: {
        Authorization: `Basic ${getAuthHeader()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
      },
      data: qs.stringify({
        redirect_uri: 'oob',
        grant_type: 'refresh_token',
        refresh_token: token,
      }),
    }).catch((err) => {
      console.error(`Error in refreshAuthorizationToken(): ${err}`);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
      }
      console.log(err.config);
    });
  },

  // Hit the Yahoo Fantasy API
  async makeAPIrequest(url, user) {
    const credentials = await getCredentials(user);

    let response;
    try {
      response = await axios({
        url,
        method: 'get',
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
        },
      });
      const jsonData = JSON.parse(parser.toJson(response.data));
      return jsonData;
    } catch (err) {
      if (
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.description &&
        err.response.data.error.description.includes('token_expired')
      ) {
        console.log("Access token requires refresh")
        const newToken = await this.refreshAuthorizationToken(
          credentials.refresh_token
        );
        if (newToken && newToken.data && newToken.data.access_token) {
          console.log("Got new access token. Storing it.")
          await credentialManager.storeCredentials(
            user.user_id,
            newToken.data.access_token,
            newToken.data.refresh_token
          );

          return this.makeAPIrequest(
            url,
            newToken.data.access_token,
            newToken.data.refresh_token
          );
        }
      } else {
        console.error(
          `Error with credentials in makeAPIrequest()/refreshAuthorizationToken(): ${err}`
        );
      }
      throw err;
    }
  },

  // Get a list of free agents
  async getFreeAgents(user) {
    try {
      const freeAgentLimit =
        CONFIG.FREE_AGENTS && /\d/.test(CONFIG.FREE_AGENTS)
          ? parseInt(CONFIG.FREE_AGENTS, 10)
          : 0;
      const promises = [];

      for (let i = 0; i <= freeAgentLimit; i++) {
        const reqUrl = this.freeAgents(i);
        promises.push(this.makeAPIrequest(reqUrl, user));
      }
      // const completedPromises = [];
      const completedPromises = await Promise.all(promises);

      const results = [];
      completedPromises.forEach((result) => {
        if (
          result.fantasy_content &&
          result.fantasy_content.league &&
          result.fantasy_content.league.players &&
          result.fantasy_content.league.players.player
        ) {
          results.push(...result.fantasy_content.league.players.player);
        }
      });
      return results;
    } catch (err) {
      console.error(`Error in getFreeAgents(): ${err}`);
      return err;
    }
  },

  // Get a list of players on my team
  async getMyPlayers() {
    try {
      const results = await this.makeAPIrequest(this.myTeam());
      return results.fantasy_content.team.roster.players.player;
    } catch (err) {
      console.error(`Error in getMyPlayers(): ${err}`);
      return err;
    }
  },

  // Get my weekly stats
  async getMyWeeklyStats() {
    try {
      const results = await this.makeAPIrequest(this.myWeeklyStats());
      return results.fantasy_content.team.team_stats.stats.stat;
    } catch (err) {
      console.error(`Error in getMyweeklyStats(): ${err}`);
      return err;
    }
  },

  // Get my scoreboard
  async getMyScoreboard() {
    try {
      const results = await this.makeAPIrequest(this.scoreboard());
      return results.fantasy_content.league.scoreboard.matchups.matchup;
    } catch (err) {
      console.error(`Error in getMyweeklyScoreboard(): ${err}`);
      return err;
    }
  },

  // Get a JSON object of your players
  async getMyPlayersStats() {
    try {
      const players = await this.getMyPlayers(this.myTeam());

      // Build the list
      let playerIDList = '';
      if (players) {
        players.forEach((player) => {
          playerIDList += `${player.player_key},`;
        });

        // Remove trailing comma
        playerIDList = playerIDList.substring(0, playerIDList.length - 1);

        const playerStats = `${this.YAHOO}/players;player_keys=${playerIDList};out=stats`;

        return await this.makeAPIrequest(playerStats);
      }
      return 'Error';
    } catch (err) {
      console.error(`Error in getMyPlayersStats(): ${err}`);
      return err;
    }
  },

  // Get what week it is in the season
  async getCurrentWeek(user) {
    try {
      console.log(`Getting current week for userId: ${user.user_id} email: ${user.email}`);
      const results = await this.makeAPIrequest(this.metadata(), user);
      return results.fantasy_content.league.current_week;
    } catch (err) {
      console.error(`Error in getCurrentWeek(): ${err}`);
      throw err;
    }
  },

  // Get the numerical prefix for the league. Was 388 in 2019
  async getLeaguePrefix() {
    try {
      const results = await this.makeAPIrequest(this.gameKey());
      return results.fantasy_content.game.game_id;
    } catch (err) {
      console.error(`Error in getLeaguePrefix(): ${err}`);
      return err;
    }
  },

  // Get the adds, drops and trades
  async getTransactions() {
    try {
      const results = await this.makeAPIrequest(this.transactions());
      return results.fantasy_content.league.transactions;
    } catch (err) {
      console.error(`Error in getTransactions(): ${err}`);
      return err;
    }
  },

  // Get user info
  async getUserInfo() {
    try {
      const results = await this.makeAPIrequest(this.user());
      return results.fantasy_content.users.user.games;
    } catch (err) {
      console.error(`Error in getUserInfo(): ${err}`);
      return err;
    }
  },

  // Get stats IDs
  async getStatsIDs() {
    try {
      const results = await this.makeAPIrequest(this.statsID());
      return results.fantasy_content.game.stat_categories.stats;
    } catch (err) {
      console.error(`Error in getStatsIDs(): ${err}`);
      return err;
    }
  },

  // See who's starting on your team
  async getCurrentRoster() {
    try {
      const results = await this.makeAPIrequest(this.roster());
      return results.fantasy_content.team.roster.players;
    } catch (err) {
      console.error(`Error in getCurrentRoster(): ${err}`);
      return err;
    }
  },
};
