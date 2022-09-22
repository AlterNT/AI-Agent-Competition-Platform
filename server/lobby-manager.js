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
     * @param {boolean, object} privateMode for private games
     * @param {boolean, object} tournamentMode for tournament games
     * @returns true if agent successfully added to lobby, false otherwise
     */
    static async joinLobby(agentToken, gameID, privateMode=false, tournamentMode=false) {
        // authorisation
        const authorised = await Database.isUserEligibleToPlay(agentToken)
        if (!authorised) { return false }

        console.log('success')

        // if agent already in game
        const currentGame = this.agentGame[agentToken]
        if (currentGame) {
            if (!currentGame.finished) { return false }
            delete this.agentGame[agentToken]
        }

        // if agent already in lobby
        const currentLobby = this.agentLobby[agentToken]
        if (currentLobby) { currentLobby.removeAgent(agentToken) }

        // join generic lobby
        if (!privateMode && !tournamentMode) {
            const lobby = this.lobbies[gameID] ? this.lobbies[gameID] : new Lobby(gameID, gameID)
            const success = lobby.addAgent(agentToken)
            if (!success) { return false }
            this.lobbies[gameID] = lobby
            this.agentLobby[agentToken] = lobby
        }

        // join private lobby
        if (privateMode) {
            const privateLobby = this.lobbies[privateMode.lobbyID] ? this.lobbies[privateMode.lobbyID] : new PrivateLobby(gameID, privateMode.lobbyID, privateMode.password)
            const success = privateLobby.addAgent(agentToken, privateMode.password)
            if (!success) { return false }
            this.lobbies[privateMode.lobbyID] = privateLobby
            this.agentLobby[agentToken] = privateLobby
        }

        // join tournament lobby
        if (tournamentMode) {
            const tournamentLobby = this.lobbies[tournamentMode.lobbyID] ? this.lobbies[tournamentMode.lobbyID] : new TournamentLobby(gameID, tournamentMode.lobbyID, tournamentMode.password)
            const success = tournamentLobby.addAgent(agentToken, tournamentMode.password)
            if (!success) { return false }
            this.lobbies[tournament.tournamentMode] = tournamentLobby
            this.agentLobby[agentToken] = tournamentLobby

        }

        // attempt to start game
        const lobby = this.agentLobby[agentToken]
        const game = lobby.startGame()

        if (game) {
            console.log(`Game Started (${lobby.gameID}): `, lobby.agentTokens)
            lobby.agentTokens.forEach((agentToken) => { 
                this.agentGame[agentToken] = game 
                delete this.agentLobby[agentToken]
            })
            delete this.lobbies[lobby.lobbyID]
        }

        return true
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
            const agentTokens = game.agentTokens
            agentTokens.forEach((agentToken) => delete this.agentGame[agentToken])
        }

        return gameFinished
    }

    static isTurn(agentToken) {
        const game = this.agentGame[agentToken]
        const isTurn = game?.isTurn(agentToken) || false
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

export default LobbyManager