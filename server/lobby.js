import child_process from 'child_process'
import fs from 'fs'

class Lobby {
    constructor(gameID, lobbyID) {
        this.id = lobbyID
        this.agents = []
        this.gameSettings = this.gameSettings(gameID)
        this.game = null
    }

    addAgent(agentToken) {
        this.agents.push(agentToken)
    }

    gameSettings(gameID) {
        const gameSettings = JSON.parse(fs.readFileSync(`./games/${gameID}/settings.json`))
        return gameSettings
    }

    startGame() {
        if (this.agents.length >= this.gameSettings.maxPlayers && this.agents.length <= this.gameSettings.maxPlayers) {
            this.game = child_process.spawn(['bash', `./games/${gameID}/start.sh`])
        }
    }
}

export default Lobby