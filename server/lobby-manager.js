import Lobby from './lobby.js';

const MAX_PLAYERS = 4

class LobbyManager {
    constructor() {
        this.lobbies = {}
        this.agentMap = {}
    }

    createLobby(gameID) {
        const lobby = new Lobby(gameID)
        this.lobbies[gameID] = lobby
    }

    joinLobby(agentToken, gameID) {
        // checks if there is a lobby for this game and creates one if there isnt
        if (this.lobbies[gameID] == undefined) {
            this.createLobby(gameID)
        }

        const lobby = this.lobbies[gameID]
        lobby.addAgent(agentToken)

        if (lobby.agents.length == lobby.gameSettings.maxPlayers) {
            const lobby = this.lobbies[gameID]
            const game = lobby.startGame()
            for (const agent of lobby.agents) {
                this.agentMap[agent] = game
            }
            delete this.lobbies[gameID]
        }
    }

    action(agentToken, action) {
        if (!(agentToken in this.agentMap)) {
            return
        }

        if (!this.isTurn(agentToken)) {
            return
        }

        const game = this.agentMap[agentToken]
        game.resolve(action.value)
    }

    method(agentToken, method, params) {
        if (!(agentToken in this.agentMap)) { return }

        if (!this.isTurn(agentToken)) { return }

        const game = this.agentMap[agentToken]
        const data = game[method](...params)
    }

    isTurn(agentToken) {
        if (agentToken in this.agentMap) {
            const game = this.agentMap[agentToken]
            return game.turn == agentToken
        } 

        return false
    }
}

export default LobbyManager