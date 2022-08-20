const fetch = require('node-fetch')

const SERVER_API_ENDPOINT = 'http://localhost:8080/api'
class ServerHandler {
    constructor() {
        this.serverAPI = SERVER_API_ENDPOINT
    }

    startGame(agentToken, gameID) {
        const body = {
            agentToken: agentToken,
            gameID: gameID
        }

        const response = await fetch(this.serverAPI, { method: 'POST', body: body });
        console.log(response)
    }
}