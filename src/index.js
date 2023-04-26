// import the express module and create an express app
require("dotenv").config();
// console.log(process.env) // Get environment variables from .env file(s)

const express = require('express');

const cors = require('cors')

const bodyParser = require('body-parser')



// const database = require('./database/initialize-database');
// database.init();

const app = express();
app.use(cors());
app.use(bodyParser.json())
// import the team stats cacher
const weatherRefresher = require('./weather/weather-refresher')
const teamStatsRefresher = require('./team-stats/team-stats-refresher');
const projectedLineupRefresher = require('./projected-lineups/projected-lineup-refresher');

// import the controllers
const freeAgentsController = require('./controllers/freeAgentsController');
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const yahooController = require('./controllers/yahooController')
const userLeagueController = require('./controllers/userLeaguesController')
const rosterController = require('./controllers/rosterController')
const teamStatsController = require('./controllers/teamStatsController')
const userTeamController = require('./controllers/userTeamController')
const weatherController = require('./controllers/weatherController')
const watchlistController = require('./controllers/watchlistController')

app.use('/getFreeAgents', freeAgentsController);
app.use('/login', loginController);
app.use('/register', registerController);
app.use('/yahoo', yahooController);
app.use('/leagues', userLeagueController);
app.use('/roster', rosterController);
app.use('/teamStats', teamStatsController)
app.use('/userTeams', userTeamController)
app.use('/weather', weatherController)
app.use('/watchlist', watchlistController);
// start the server
const port = (process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
