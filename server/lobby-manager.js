import Lobby from './lobby.js';

const MAX_PLAYERS = 4

class LobbyManager {
    constructor() {
        this.lobbies = {}
        this.agentMap = {}
        this.lobbyCount = 0 // currently will just keep increasing
    }

    createLobby(gameID) {
        const lobby = new Lobby(gameID, this.lobbyCount++)
        this.lobbies[gameID] = lobby
    }

    joinLobby(agentToken, gameID) {
        // checks if there is a lobby for this game and creates one if there isnt
        if (this.lobbies[gameID] == undefined) {
            this.createLobby(gameID)
        }

        const lobby = this.lobbies[gameID]
        lobby.addAgent(agentToken)

        this.agentMap[agentToken] = { lobbyID: this.lobbyCount, gameID: gameID }

    }


}

export default LobbyManager