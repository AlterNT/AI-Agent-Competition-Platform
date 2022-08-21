const fetch = require('node-fetch')

const SERVER_API_ENDPOINT = 'http://localhost:8080/api'
class ServerHandler {
    constructor(agentToken, gameID) {
        this.serverAPI = SERVER_API_ENDPOINT
        this.agentToken = agentToken
        this.gameID = gameID
    }

    joinLobby() {
        const body = {
            agentToken: this.agentToken,
            gameID: this.gameID
        }

        const response = await fetch(this.serverAPI + '/join-lobby', { method: 'GET', body: body });

        // handle error if could not join lobby
    }

    getGameState(agentToken) {
        const body = {
            agentToken: this.agentToken
        }

        const response = await fetch(this.serverAPI + '/game', { method: 'GET', body: body });
        
        // handle error if could not request game state
    }

    run() {
        this.joinLobby()
        
        while (true) {
            
        }
    }
}