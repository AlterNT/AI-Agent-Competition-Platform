import { Lobby, PrivateLobby, TournamentLobby } from './lobbies/lobbies.js'
import Database from './database.js'

class LobbyManager {
    static lobbies = {}
    static agentLobby = {}
    static agentGame = {}

    /**
     * adds agent to lobby
     * @param {string} agentToken agent token
     * @param {string} gameID id of game to be played
     * @param {string} lobbyID id of the lobby requested
     * @param {{}} options lobby options.
     * @returns true if agent successfully added to lobby, false otherwise
     */
    static async joinLobby(agentToken, gameID, lobbyID = 0, options = { password: '', tournament: false }) {
        // authorisation
        const authorised = await Database.isUserEligibleToPlay(agentToken)
        if (!authorised) { return { success: false } }

        // if agent already in game
        const currentGame = this.agentGame[agentToken]
        if (currentGame) {
            if (!currentGame.gameFinished()) { return { success: false } }
            delete this.agentGame[agentToken]
        }

        // if agent already in lobby
        const currentLobby = this.agentLobby[agentToken]
        if (currentLobby) { currentLobby.removeAgent(agentToken) }

        // join lobby
        const lobby = this.lobbies[lobbyID] ?? new Lobby(gameID, options)
        const success = lobby.addAgent(agentToken, options?.password)
        if (!success) { return { success: false } }
        this.agentLobby[agentToken] = lobby
        this.lobbies[lobbyID] = lobby

        console.log(`Agent ${agentToken} successfully joined lobby #${lobbyID} for ${gameID}!`);

        // attempt to start game
        if (lobby.isFull()) {

            const game = await lobby.initGame()

            if (game) {
                lobby.tokens.forEach((agentToken) => {
                    this.agentGame[agentToken] = game
                    delete this.agentLobby[agentToken]
                })
                delete this.lobbies[lobbyID]
                console.log(`Game Started (${lobby.gameID}): `, lobby.tokens)
                game.main();
            }
        }

        return { success, lobbyID }
    }

    static gameStarted(agentToken) {
        const started = this.agentGame[agentToken] !== undefined
        return started
    }

    static gameFinished(agentToken) {
        const game = this.agentGame[agentToken]

        if (!game) { return true }

        const gameFinished = game.gameFinished()

        if (gameFinished) {
            const agents = game.agents
            agents.forEach((agent) => delete this.agentGame[agent.token])
        }

        return gameFinished
    }

    static isTurn(agentToken) {
        const game = this.agentGame[agentToken]
        const isTurn = (game?.turn === agentToken) ?? false
        return isTurn
    }

    static getState(agentToken) {
        const game = this.agentGame[agentToken]
        const state = game.getState(agentToken)
        return state
    }

    static action(agentToken, action) {
        const game = this.agentGame[agentToken]
        return game.action(agentToken, action)
    }

    static method(agentToken, keys, method, params) {
        const game = this.agentGame[agentToken]

        let object = game
        keys.forEach((key) => object = object[key])
        const result = object[method](...params)
        return result
    }
}

export default LobbyManager;