const axios = require('axios');
const logger = require('../logger/logger');
const gamecastEventEmitter = require('./gamecast-event-emitter');

async function getLiveGameStats() {
  logger.debug(`Getting live game stats...`);

  const gameScheduleUrl = `https://statsapi.mlb.com/api/v1/schedule?sportId=1`;
  const schedule = await axios.get(gameScheduleUrl);

  const hasGames = schedule?.data?.dates?.[0]?.games?.length > 0;
  if (!hasGames) {
    logger.debug('no games returned on the schedule...');
    return;
  }

  const inProgressGames = schedule.data.dates[0].games.filter(
    (g) => g.status.statusCode === 'I'
  );
  if (inProgressGames.length === 0) {
    logger.debug('no in progress games...');
    return;
  }

  const inProgressGameLinks = inProgressGames.map((g) => g.link);

  const currentHitters = [];

  for (let i = 0; i < inProgressGameLinks.length; i++) {
    const gameUrl = `https://statsapi.mlb.com${inProgressGameLinks[i]}`;

    const gameInfo = await axios.get(gameUrl);

    const gameId = gameInfo.data.gameData.game.pk;
    const allPlays = gameInfo.data.liveData?.plays?.allPlays;
    const currentPlay = gameInfo?.data?.liveData?.plays?.currentPlay;

    const previousPlay = gameInfo?.data?.liveData?.plays?.allPlays?.find(
      (p) => p.about.atBatIndex == currentPlay?.about?.atBatIndex - 1
    );

    const matchup = currentPlay?.matchup;
    const currentPlayEvents = currentPlay?.playEvents;

    const currentInfo = {
      gameId,
      matchup,
      currentPlayEvents,
      previousPlay,
      allPlays,
    };
    currentHitters.push(currentInfo);

    // decide what information I want to share with the client
  }

  if (currentHitters.length > 0) {
    logger.debug('Emitting events');
    gamecastEventEmitter.emit('newGameData', currentHitters);
  }
}

getLiveGameStats();

setInterval(getLiveGameStats, 1 * 60 * 1000);

module.exports = { getLiveGameStats };
