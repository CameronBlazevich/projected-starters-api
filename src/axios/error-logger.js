const logger = require('../logger/logger')

const logError = (error) => {
    logger.error(error)
    // if (error.response) {
    //     // The request was made and the server responded with a status code
    //     // that falls out of the range of 2xx
    //     logger.error(error.response.data);
    //     logger.error(error.response.status);
    //     // logger.error(error.response.headers);
    // } else if (error.request) {
    //     // The request was made but no response was received
    //     // `error.request` is an instance of XMLHttpRequest in the browser 
    //     // and an instance of http.ClientRequest in node.js
    //     logger.error(error.request);
    // }
    // else {
    //     logger.error(error.message)
    // }
}

module.exports  = { logError };