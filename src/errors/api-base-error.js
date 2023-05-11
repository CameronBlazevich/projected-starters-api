const logger = require('../logger/logger')

class ApiBaseError extends Error {
    constructor(thirdPartyStatusCode, statusCode, message) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = this.constructor.name;
        this.statusCode = statusCode
        this.thirdPartyStatusCode = thirdPartyStatusCode;
        this.thirdPartyMessage = message;
        Error.captureStackTrace(this)
    }
}

module.exports = ApiBaseError