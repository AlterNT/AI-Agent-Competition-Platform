import child_process from 'child_process'
import fs from 'fs'
import PaperScizzorsRock from './games/paper-scizzors-rock/paper-scizzors-rock.js'

class Lobby {
    constructor(gameID) {
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
        return new PaperScizzorsRock(this.agents)
    }
}

export default Lobby