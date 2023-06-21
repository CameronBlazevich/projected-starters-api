const express = require('express');
const { getUserTeams } = require('../database/user-teams');
const { getRosteredPlayers, getIdsForRosteredPlayers } = require('../roster/roster-service');
const { getByYahooIds } = require('../database/player-id-lookup');
const auth = require('../request-handling/middleware');
const router = express.Router();
const gamecastEventEmitter = require('../gamecast/gamecast-event-emitter');
const logger = require('../logger/logger');

let clients = [];
let facts = [];

function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);



    const data = `data: ${JSON.stringify(facts)}\n\n`; // \n\n indicates the end of an event

    response.write(data);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        response
    };

    clients.push(newClient);

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
}

gamecastEventEmitter.on('newGameData', (newData) => {
    logger.debug('data caught')
    sendEventsToAll(newData)
})

function sendEventsToAll(event) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(event)}\n\n`))
}

async function test(request, respsonse, next) {
    const newFact = request.body;
    facts.push(newFact);
    respsonse.json(newFact)
    return sendEventsToAll(newFact);
}

router.post('/fact', test);


router.get('/events', eventsHandler);

router.get('/allRosteredPlayers', auth, async (req, res) => {
    const user = req.user;
    const allTeams = await getUserTeams(user.user_id);

    const rosteredPlayers = [];

    for (let i = 0; i < allTeams.length; i++) {
        const team = allTeams[i];
        const playerIds = getIdsForRosteredPlayers(team.user_id, team.league_id, team.team_id);
        rosteredPlayers.push(playerIds)
    }

    return res.status(200).json(rosteredPlayers);
})

module.exports = router;