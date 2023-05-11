const httpStatusCodes = require('./http-status-codes')
const ApiBaseError = require('./api-base-error')

class ApiServiceUnavailableError extends ApiBaseError {
    constructor(message, statusCode) {
        super(httpStatusCodes.SERVICE_UNAVAILABLE, statusCode, message)
    }
}

module.exports = ApiServiceUnavailableError