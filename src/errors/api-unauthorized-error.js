const httpStatusCodes = require('./http-status-codes')
const ApiBaseError = require('./api-base-error')

class ApiUnauthorizedError extends ApiBaseError {
    constructor(message, statusCode) {
        super(httpStatusCodes.UNAUTHORIZED, statusCode, message)
    }
}

module.exports = ApiUnauthorizedError