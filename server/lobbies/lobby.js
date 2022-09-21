import fs from 'fs'
import { PaperScissorsRock, LoveLetter } from '../games/games.js'

class Lobby {
    constructor(gameID, lobbyID) {
        this.gameID = gameID
        this.lobbyID = lobbyID
        this.agentTokens = []
        this.settings = this.loadSettings()
    }

    loadSettings() {
        const settings = JSON.parse(fs.readFileSync(`./games/${this.gameID}/settings.json`))
        return settings
    }

    addAgent(agentToken) {
        // lobby full (should not be possible)
        if (this.agentTokens.length >= this.settings.maxPlayers) { return false }

        // lobby already has agent
        if (this.agentTokens.includes(agentToken)) { return false }

        this.agentTokens.push(agentToken)

        return true
    }

    removeAgent(agentToken) {
        this.agentTokens = this.agentTokens.filter((token) => token != agentToken)
    }

    startGame() {
        // too few players
        if (this.agentTokens.length < this.settings.minPlayers) { return false }

        // too many players (should not be possible)
        if (this.agentTokens.length > this.settings.maxPlayers) { return false }
        
        let game
        if (this.gameID == 'paper-scissors-rock') {
            game = new PaperScissorsRock(this.agentTokens)
        }

        if (this.gameID == 'love-letter') {
            game = new LoveLetter(this.agentTokens)
        }

        game.main()
        return game
    }
}

export default Lobby