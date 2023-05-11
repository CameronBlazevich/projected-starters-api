const httpStatusCodes = require('./http-status-codes')
const ApiBaseError = require('./api-base-error')

class ApiForbiddenError extends ApiBaseError {
    constructor(message, statusCode) {
        super(httpStatusCodes.FORBIDDEN, statusCode, message)
    }
}

module.exports = ApiForbiddenError