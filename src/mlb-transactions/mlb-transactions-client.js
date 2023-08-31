const axios = require('axios');
const { logError } = require('../axios/error-logger');

const getTransactions = async () => {

    const url = process.env.RETROSHEET_SERVICE_URL;
    const urlParams = `mlbTransactions/`

    try {
        const resp = await axios.get(`${url}${urlParams}`);
        return resp.data;
    } catch (err) {
        logError(err);
    }
}

module.exports = { getTransactions }