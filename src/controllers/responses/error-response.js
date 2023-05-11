const ApiBaseError = require("../../errors/api-base-error")
const logger = require('../../logger/logger')

const createErrorResponse = (response, error) => {
    if (error instanceof ApiBaseError) {
        return response.status(error.statusCode).json({ message: error.thirdPartyMessage })
    }

    logger.error(error);
    return response.status(500).json({ message: "Something went wrong..." })
}

module.exports = { createErrorResponse }