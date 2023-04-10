// import the express module and create an express app
const express = require('express');

const database = require('./database/initialize-database');
database.init();

const app = express();

// import the team stats cacher
const teamStatsRefresher = require('./team-stats/team-stats-refresher');
const projectedLineupRefresher = require('./projected-lineups/projected-lineup-refresher');

// import the controllers
const freeAgentsController = require('./controllers/freeAgentsController');

app.use('/getFreeAgents', freeAgentsController);

// start the server
const port = (process.env.port || 3000);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
