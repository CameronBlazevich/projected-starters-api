const credentialManager = require('../database/credentials');
const qs = require('qs');
const axios = require('axios');
const parser = require('xml2json');
const CONFIG = require('../../config.json');
const { getAuthCode } = require('../database/user-yahoo-info');
const { logError } = require('../axios/error-logger');
const ApiUnauthorizedError = require('../errors/api-unauthorized-error');
const { parseErrorMessage } = require('./yahoo-error-parser');
const ApiForbiddenError = require('../errors/api-forbidden-error');
const httpStatusCodes = require('../errors/http-status-codes');
const ApiBaseError = require('../errors/api-base-error');
const logger = require('../logger/logger')

function getAuthHeader() {
  const authHeader = Buffer.from(
    `${process.env.YAHOO_CLIENT_ID}:${process.env.YAHOO_CLIENT_SECRET}`,
    `binary`
  ).toString(`base64`);

  return authHeader;
}

function getAuthEndpoint() {
  return `https://api.login.yahoo.com/oauth2/get_token`;
}

async function getInitialAuthorization(userAuthCode) {
  console.log(`Getting initial authorization... with auth code: ${userAuthCode}`);
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
      client_id: process.env.YAHOO_CLIENT_ID,
      client_secret: process.env.YAHOO_CLIENT_SECRET,
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
async function getCredentials(userId) {
  try {
    const credentials = await credentialManager.getCredentials(userId);
    if (credentials?.access_token) {
      return credentials;
    } else {
      const userAuthCode = await getAuthCode(userId);
      if (!userAuthCode) {
        return {};
      }
      logger.debug(`User Auth Code Found: ${JSON.stringify(userAuthCode)}`);

      const newToken = await getInitialAuthorization(userAuthCode.auth_code);
      if (newToken && newToken.data && newToken.data.access_token) {
        const newCreds = await credentialManager.storeCredentials(
          userId,
          newToken.data.access_token,
          newToken.data.refresh_token
        );

        const updatedCreds = {
          access_token: newToken.data.access_token,
          refresh_token: newToken.data.refresh_token
        }

        logger.debug("Successfully got new creds...")
        return updatedCreds;
      }
      return credentials;
    }
  } catch (err) {
    logger.info(`Error retrieving credentials for user ${userId}: ${err}`);
    logger.error(err);
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
  freeAgents(i, leagueId) {
    const startNum = i;
    const url = `${this.YAHOO}/league/422.l.${leagueId
      }/players;status=A;count=25;start=${startNum * 25};position=SP;sort=AR`;
    // console.log(url);
    return url;
  },
  playersInLeagueContextTaken(leagueId, playerIds) {
    const mapped = playerIds.map(p => `422.p.${p}`);
    const playerIdString = mapped.join(',');
    const url = `${this.YAHOO}/league/422.l.${leagueId
    }/players;status=W;player_keys=${playerIdString};`;
    return url;
  },  
  playersInLeagueContextAvailable(leagueId, playerIds) {
    const mapped = playerIds.map(p => `422.p.${p}`);
    const playerIdString = mapped.join(',');
    const url = `${this.YAHOO}/league/422.l.${leagueId
    }/players;status=FA;player_keys=${playerIdString};`;
    return url;
  },
  myTeam(leagueId, teamId) {
    const url = `${this.YAHOO}/team/422.l.${leagueId}.t.${teamId}/roster/`;
    console.log(url)
    return url;
  },
  weeklyStats(leagueId, teamId, weekNumber) {
    return `${this.YAHOO}/team/422.l.${leagueId}.t.${teamId}/stats;type=week;week=${weekNumber}`;
  },
  teamSeasonStats(leagueId, teamId) {
    return `${this.YAHOO}/team/422.l.${leagueId}.t.${teamId}/stats;type=season`;
  },
  leagueSeasonStats(leagueId) {
    return `${this.YAHOO}/league/422.l.${leagueId}/standings`;
  },
  leagueSettings(leagueId) {
    return `${this.YAHOO}/league/422.l.${leagueId}/settings`;
  },
  teamMatchups(leagueId, teamId) {
    return `${this.YAHOO}/team/422.l.${leagueId}.t.${teamId}/matchups`;
  },
  scoreboard(leagueId, weekNumber) {
    return `${this.YAHOO}/league/422.l.${leagueId}/scoreboard;week=${weekNumber}`;
  },
  metadata(leagueId) {
    return `${this.YAHOO}/league/422.l.${leagueId}/metadata`;
  },
  transactions() {
    return `${this.YAHOO}/league/${CONFIG.LEAGUE_KEY}/transactions;types=add,trade,drop`;
  },
  user() {
    return `${this.YAHOO}/users;use_login=1/games`;
  },
  statsID() {
    return `${this.YAHOO}/game/422/stat_categories`;
  },
  roster(leagueId, teamId, date) {
    return `${this.YAHOO}/team/422.l.${leagueId}.t.${teamId}/roster;date=${date}`;
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
      logError(err)
      console.log(err.config);
    });
  },

  async makeApiRequestWithCreds(url, userId, credentials) {
    logger.info(`making an api request to ${url}`)
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
        err.response?.data &&
        err.response.data.error &&
        err.response.data.error.description &&
        err.response.data.error.description.includes('token_expired')
      ) {
        console.log("Access token requires refresh")
        const newToken = await this.refreshAuthorizationToken(
          credentials.refresh_token
        );
        if (newToken && newToken.data && newToken.data.access_token) {
          await credentialManager.storeCredentials(
            userId,
            newToken.data.access_token,
            newToken.data.refresh_token
          );

          credentials.access_token = newToken.data.access_token;
          credentials.refresh_token = newToken.data.refresh_token;
          return await this.makeApiRequestWithCreds(
            url,
            userId,
            credentials
          );
        }
      } else {
          logError(err);
          if (err.response?.status === 401) {
            throw new ApiUnauthorizedError("Yahoo authentication failure.", httpStatusCodes.FORBIDDEN);
          } else if (err.response?.status === 403) { 
            const errorDesc = parseErrorMessage(err);
            logger.debug(errorDesc)
            throw new ApiForbiddenError(errorDesc, httpStatusCodes.FORBIDDEN);
          } else {
            const errorDesc = parseErrorMessage(err);
            throw new ApiBaseError(err.response?.status, httpStatusCodes.FORBIDDEN, errorDesc)
          }
      }
    }
  },


  async makeAPIrequest(url, userId) {
    const credentials = await getCredentials(userId);
      const result = await this.makeApiRequestWithCreds(url, userId, credentials)
      return result;
  },

  async getFreeAgentsWithCredentials(credentials, leagueId, userId) {
    const freeAgentPageLimit = 10;

    const results = [];
    try {
    for (let i = 0; i <= freeAgentPageLimit; i++) {
      const reqUrl = this.freeAgents(i, leagueId);
      const result = await this.makeApiRequestWithCreds(reqUrl, userId, credentials);

      if (
        result.fantasy_content &&
        result.fantasy_content.league &&
        result.fantasy_content.league.players &&
        result.fantasy_content.league.players.player
      ) {
        results.push(...result.fantasy_content.league.players.player);
      }

    }
    return results;
  } catch (err) {
    logger.error(err);
    throw err;
  }
  },

  // Get a list of free agents
  async getFreeAgents(userId, leagueId) {
      const credentials = await getCredentials(userId);
      const result = await this.getFreeAgentsWithCredentials(credentials, leagueId, userId);
      return result;
  },

  async addPlayerWithCredentials(userId, addPlayerId, dropPlayerId, leagueId, teamId, credentials) {
    const url = `${this.YAHOO}/league/422.l.${leagueId}/transactions`;

    const headers = {
      Authorization: `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/xml',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
    };

    const addDropXmlBody = `
    <fantasy_content>
      <transaction>
        <type>add/drop</type>
        <players>
          <player>
            <player_key>422.p.${addPlayerId}</player_key>
            <transaction_data>
              <type>add</type>
              <destination_team_key>422.l.${leagueId}.t.${teamId}</destination_team_key>
            </transaction_data>
          </player>
          <player>
            <player_key>>422.p.${dropPlayerId}</player_key>
            <transaction_data>
              <type>drop</type>
              <source_team_key>422.l.${leagueId}.t.${teamId}</source_team_key>
            </transaction_data>
          </player>
        </players>
      </transaction>
    </fantasy_content>
    `

    try {
      logger.debug(`url: ${url}. headers: ${headers}. body: ${addDropXmlBody}`)
      const response = await axios.post(url, addDropXmlBody, {headers});
      return response;
    } catch (err) {
      logError(err);
      if (
        err.response?.data &&
        err.response.data.error &&
        err.response.data.error.description &&
        err.response.data.error.description.includes('token_expired')
      ) {
        console.log("Access token requires refresh")
        const newToken = await this.refreshAuthorizationToken(
          credentials.refresh_token
        );
        if (newToken && newToken.data && newToken.data.access_token) {
          await credentialManager.storeCredentials(
            userId,
            newToken.data.access_token,
            newToken.data.refresh_token
          );

          credentials.access_token = newToken.data.access_token;
          credentials.refresh_token = newToken.data.refresh_token;
          const response = await this.addPlayerWithCredentials(
            userId,
            addPlayerId,
            dropPlayerId,
            leagueId, 
            teamId,
            credentials
          );

          return response;
        }
      } else {
          logError(err);
          if (err.response?.status === 401) {
            throw new ApiUnauthorizedError("Yahoo authentication failure.", httpStatusCodes.FORBIDDEN);
          } else if (err.response?.status === 403) { 
            const errorDesc = parseErrorMessage(err);
            logger.debug(errorDesc)
            throw new ApiForbiddenError(errorDesc, httpStatusCodes.FORBIDDEN);
          } else {
            const errorDesc = parseErrorMessage(err);
            throw new ApiBaseError(err.response?.status, httpStatusCodes.FORBIDDEN, errorDesc)
          }
      }
    }
  },

  async addPlayer(userId, addPlayerId, dropPlayerId, leagueId, teamId) {
    const credentials = await getCredentials(userId);
    
    return await this.addPlayerWithCredentials(userId, addPlayerId, dropPlayerId, leagueId, teamId, credentials)

  },

  // Get a list of players on my team
  async getMyPlayers(userId, leagueId, teamId) {
    try {
      const results = await this.makeAPIrequest(this.myTeam(leagueId, teamId), userId);
      return results.fantasy_content.team.roster.players.player;
    } catch (err) {
      console.error(`Error in getMyPlayers(): ${err}`);
      throw err;
    }
  },

  async getPlayersInLeagueContext(userId, leagueId, playerIdArray) {
    try {
      const takenPlayers = await this.makeAPIrequest(this.playersInLeagueContextTaken(leagueId, playerIdArray), userId)
      const availablePlayers = await this.makeAPIrequest(this.playersInLeagueContextAvailable(leagueId, playerIdArray), userId)
      
      return {taken: takenPlayers.fantasy_content.league.players, available: availablePlayers.fantasy_content.league.players};
      return results.fantasy_content.league.players;
    } catch (error) {
      console.error(`Error in getPlayersInLeagueContext(): ${error}`);
      throw error;
    }
  },


  // Get my weekly stats
  async getWeeklyStats(userId, leagueId, teamId, weekNumber) {
    try {
      const results = await this.makeAPIrequest(this.weeklyStats(leagueId, teamId, weekNumber), userId);
      return results.fantasy_content.team.team_stats.stats.stat;
    } catch (err) {
      console.error(`Error in getWeeklyStats(): ${err}`);
      throw err;
    }
  },

  // Get my weekly stats
  async getTeamSeasonStats(userId, leagueId, teamId) {
    try {
      const results = await this.makeAPIrequest(this.seasonStats(leagueId, teamId), userId);
      return results.fantasy_content.team.team_stats.stats.stat;
    } catch (err) {
      console.error(`Error in getWeeklyStats(): ${err}`);
      throw err;
    }
  },

  // Get my weekly stats
  async getLeagueSeasonStats(userId, leagueId) {
    try {
      const results = await this.makeAPIrequest(this.leagueSeasonStats(leagueId), userId);
      return results.fantasy_content.league;
    } catch (err) {
      console.error(`Error in getWeeklyStats(): ${err}`);
      throw err;
    }
  },

  async getLeagueSettings(userId, leagueId) {
    try {
      const results = await this.makeAPIrequest(this.leagueSettings(leagueId), userId);
      return results.fantasy_content.league;
    } catch (err) {
      console.error(`Error in getWeeklyStats(): ${err}`);
      throw err;
    }
  },
  async getTeamMatchups(userId, leagueId, teamId) {
    try {
      const results = await this.makeAPIrequest(this.teamMatchups(leagueId, teamId), userId);
      return results.fantasy_content.team.matchups.matchup;
    } catch (err) {
      console.error(`Error in getWeeklyStats(): ${err}`);
      throw err;
    }
  },

  // Get my scoreboard
  async getMyScoreboard(userId, leagueId, weekNumber) {
    try {
      const results = await this.makeAPIrequest(this.scoreboard(leagueId, weekNumber), userId);
      return results.fantasy_content.league.scoreboard.matchups.matchup;
    } catch (err) {
      console.error(`Error in getMyweeklyScoreboard(): ${err}`);
      throw err;
    }
  },

  // Get a JSON object of your players
  async getMyPlayersStats(userId, leagueId, teamId) {
    try {
      const players = await this.getMyPlayers(userId, leagueId, teamId);;
      console.log(`Players: ${players}`)

      // Build the list
      let playerIDList = '';
      if (players) {
        players.forEach((player) => {
          playerIDList += `${player.player_key},`;
        });

        // Remove trailing comma
        playerIDList = playerIDList.substring(0, playerIDList.length - 1);

        const playerStats = await this.getPlayersByIds(userId, playerIDList, leagueId);

        return playerStats;
      }
    } catch (err) {
      console.error(`Error in getMyPlayersStats(): ${err}`);
      throw err;
    }
  },

  async getPlayersByIds(userId, playerIdsList, leagueId) {
    const countPlayers = playerIdsList.split(',').length;
    let playersStatsUrl = `${this.YAHOO}/league/422.l.${leagueId
      }/players;player_keys=${playerIdsList};sort=AR;out=stats`;

    const playerStatsResponse = await this.makeAPIrequest(playersStatsUrl, userId);

    const statIds = await this.getStatsIDs(userId); // ToDo: This should just be a static lookup, no need to go to Yahoo each time!!!
    // addKnownAdvancedStats(statIds)
    const playerStats = playerStatsResponse.fantasy_content.league.players.player;

    // mapStatsOntoPlayers(playerStats, statIds);
    return playerStats;
  },


  // Get what week it is in the season
  async getCurrentWeek(userId, leagueId) {
    try {
      const results = await this.makeAPIrequest(this.metadata(leagueId), userId);
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
  async getStatsIDs(userId) {
    try {
      const results = await this.makeAPIrequest(this.statsID(), userId);
      return results.fantasy_content.game.stat_categories.stats;
    } catch (err) {
      console.error(`Error in getStatsIDs(): ${err}`);
      throw err;
    }
  },

  // See who's starting on your team
  async getRoster(leagueId, teamId, userId, date) {
    //date format date=2011-05-01
    try {
      const results = await this.makeAPIrequest(this.roster(leagueId, teamId, date), userId);
      return results.fantasy_content.team.roster.players;
    } catch (err) {
      console.error(`Error in getCurrentRoster(): ${err}`);
      throw err;
    }
  },
};
