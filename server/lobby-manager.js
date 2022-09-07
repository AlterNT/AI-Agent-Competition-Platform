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
        const success = lobby.addAgent(agentToken)

        if (lobby.agents.length == lobby.gameSettings.maxPlayers) {
            const lobby = this.lobbies[gameID]
            const game = lobby.startGame()
            console.log('Starting!', lobby.agents)
            for (const agent of lobby.agents) {
                this.agentMap[agent] = game
            }
            delete this.lobbies[gameID]
        }

        return success;
    }

    action(agentToken, action) {
        if (!(agentToken in this.agentMap)) {
            return
        }

        const game = this.agentMap[agentToken]
        if (!this.isTurn(agentToken)) {
            return
        }

        game.turn = null;
        game.resolve(action)
    }

    method(agentToken, method, params) {
        if (!(agentToken in this.agentMap)) { return }

        const game = this.agentMap[agentToken]
        const data = game[method](params)
        return data;
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