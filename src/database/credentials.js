const {storeApiCreds, getApiCreds} = require('./user-yahoo-info')


async function storeCredentials(userId, accessToken, refreshToken) {
  const result = await storeApiCreds(userId, accessToken, refreshToken);
  return result;
}

// Function to retrieve user credentials
async function getCredentials(userId) {
  const result = await getApiCreds(userId);
  // console.log(`Credentials obj returned from db: ${JSON.stringify(result)}`)
  return result;
}

module.exports = { getCredentials, storeCredentials };
