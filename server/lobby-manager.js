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
    static async joinLobby(agentToken, gameID, lobbyID = 0, options = {privateMode: false, tournamentMode: false}) {
        // authorisation
        const authorised = await Database.isUserEligibleToPlay(agentToken)
        if (!authorised) { return {success: false} }

        // if agent already in game
        const currentGame = this.agentGame[agentToken]
        if (currentGame) {
            if (!currentGame.gameFinished()) { return {success: false} }
            delete this.agentGame[agentToken]
        }

        // if agent already in lobby
        const currentLobby = this.agentLobby[agentToken]
        if (currentLobby) { currentLobby.removeAgent(agentToken) }

        // join generic lobby
        if (!options.privateMode && !options.tournamentMode) {
            const lobby = this.lobbies[lobbyID] ?? new Lobby(gameID, options)
            const success = lobby.addAgent(agentToken)
            if (!success) { return {success: false} }
            this.lobbies[lobbyID] = lobby
            this.agentLobby[agentToken] = lobby
        }
        /* Refactor required. Try to incorporate into just
        // join private lobby
        if (options.privateMode) {
            const privateLobby = this.lobbies[privateMode.lobbyID] ? this.lobbies[privateMode.lobbyID] : new PrivateLobby(gameID, privateMode.lobbyID, privateMode.password)
            const success = privateLobby.addAgent(agentToken, privateMode.password)
            if (!success) { return false }
            this.lobbies[privateMode.lobbyID] = privateLobby
            this.agentLobby[agentToken] = privateLobby
        }

        // join tournament lobby
        if (options.tournamentMode) {
            const tournamentLobby = this.lobbies[tournamentMode.lobbyID] ? this.lobbies[tournamentMode.lobbyID] : new TournamentLobby(gameID, tournamentMode.lobbyID, tournamentMode.password)
            const success = tournamentLobby.addAgent(agentToken, tournamentMode.password)
            if (!success) { return false }
            this.lobbies[tournament.tournamentMode] = tournamentLobby
            this.agentLobby[agentToken] = tournamentLobby

        }
        */

        console.log(`Agent ${agentToken} successfully joined lobby #${lobbyID} for ${gameID}!`);

        const lobby = this.agentLobby[agentToken];
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

        return {success: true, lobbyID: lobbyID}
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
        game.resolve(action)
        const success = true
        return success
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