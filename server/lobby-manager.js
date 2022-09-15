import Lobby from './lobby.js';

const MAX_PLAYERS = 4

class LobbyManager {
    constructor() {
        this.lobbies = {}
        this.gameMap = {}
        this.lobbyMap = {}
    }

    createLobby(gameID) {
        const lobby = new Lobby(gameID)
        this.lobbies[gameID] = lobby
    }

    joinLobby(agentToken, gameID) {
        const currentGame =  this.gameMap[agentToken]
        if (currentGame) {
            if (!currentGame.result) {
                return false;
            } else {
                delete this.gameMap[agentToken]
            }
        }

        // checks if there is a lobby for this game and creates one if there isnt
        if (this.lobbies[gameID] == undefined) {
            this.createLobby(gameID)
        }

        const previousAllocation = this.lobbyMap[agentToken]
        if (previousAllocation) {
            previousAllocation.removeAgent(agentToken)
        }

        const lobby = this.lobbies[gameID];
        const success = lobby.addAgent(agentToken)

        this.lobbyMap[agentToken] = lobby

        if (lobby.agents.length === lobby.gameSettings.maxPlayers) {
            const game = lobby.startGame()
            console.log('Starting!', lobby.agents)
            for (const agent of lobby.agents) {
                this.gameMap[agent] = game
            }
            lobby.agents.forEach((token) => {
                delete this.lobbyMap[token];
            })
            delete this.lobbies[gameID]
        }

        return success
    }

    action(agentToken, action) {
        if (!(agentToken in this.gameMap)) {
            return
        }

        const game = this.gameMap[agentToken]
        if (!this.isTurn(agentToken)) {
            return
        }

        game.turn = null;
        game.resolve(action)
    }

    method(agentToken, keys, method, params) {
        if (!(agentToken in this.gameMap)) {
            return { error: 'game not started' }
        }

        const game = this.gameMap[agentToken]
        if (!this.isTurn(agentToken)) {
            return
        }

        let object = game
        keys.forEach((key) => object = object[key])
        const data = object[method](...params)
        return data
    }

    isTurn(agentToken) {
        if (agentToken in this.gameMap) {
            const game = this.gameMap[agentToken]
            return game.turn == agentToken
        }

        return false
    }
}

export default LobbyManager