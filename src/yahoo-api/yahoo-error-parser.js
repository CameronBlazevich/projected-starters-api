const xml2js = require('xml2js');
const logger = require('../logger/logger');

const getErrorDescription = (xmlString) => {
    let description = '';
    xml2js.parseString(xmlString, function (err, result) {
        if (err) {
            console.log(`Something went wrong parsing XML Error.`);
            return "";
        }
        description = result.error.description[0];

    });
    return description;
}

const parseErrorMessage = (err) => {
    logger.debug(`attempting to parse error: ${err.response.data}`)
    let errorDesc = '';
    if (err?.response?.data) {
        errorDesc = getErrorDescription(err.response.data)
    }
   return errorDesc;
}




module.exports = { parseErrorMessage }