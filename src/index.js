// import the express module and create an express app
require("dotenv").config();
// console.log(process.env) // Get environment variables from .env file(s)

const express = require('express');

const cors = require('cors')

const bodyParser = require('body-parser')



const database = require('./database/initialize-database');
database.init();

const app = express();
app.use(cors());
app.use(bodyParser.json())

// import the controllers
const freeAgentsController = require('./controllers/freeAgentsController');
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')

app.use('/getFreeAgents', freeAgentsController);
app.use('/login', loginController)
app.use('/register', registerController)

// start the server
const port = (process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
