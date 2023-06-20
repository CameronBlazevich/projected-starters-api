const { scheduleAddDrop } = require("./roster-service");
const yahooApi = require('../yahoo-api/fantasy-baseball-api');
const { getAddDropsToExecute, setCompleted, incrementAttempts } = require("../database/add-drop-schedule");
const logger = require("../logger/logger");


async function executeAddDrop() {
    logger.debug(`Starting add/drop executor...`)
    // query for records that are in the passed and wasSuccessful = false and have < 3 attempts
    const addDropsToExecute = await getAddDropsToExecute();
    if (!(addDropsToExecute?.length > 0)) {
        logger.info(`No add drops to execute at this time...`)
        return;
    }

    // loop over them and execute them one at a time, updating the attempts and wasSuccessul and errorMessage columns
    logger.debug(`Found ${addDropsToExecute.length} records to execute...`)
    for (let i = 0; i < addDropsToExecute.length; i++) {
        const record = addDropsToExecute[i];
        try {
            if (process.env.NODE_ENV == 'production') {

                logger.debug(`Actual Execution. Adding: ${record.add_player_id} Dropping: ${record.drop_player_id} LeagueId: ${record.league_id}`)
                // const response = yahooApi.yfbb.addPlayer(record.user_id, record.add_player_id, record.drop_player_id, record.league_id, record.team_id);   
            } else {
                logger.debug(`Dev Execution. Adding: ${record.add_player_id} Dropping: ${record.drop_player_id} LeagueId: ${record.league_id}`)
            }
            await setCompleted(record.id);
        } catch (error) {
            try {
                incrementAttempts(record.id)
                logger.info('Unable to execute add/drop.')
                logger.error(error);
            } catch (err) {
                logger.info('swallowing error')
            }
            // update error message
        }
    }
}


executeAddDrop();

setInterval(executeAddDrop, 3 * 60 * 1000)


module.exports = { executeAddDrop }