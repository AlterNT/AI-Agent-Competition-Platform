import child_process from 'child_process'
import fs from 'fs'
import PaperScissorsRock from './games/paper-scissors-rock/paper-scissors-rock.js'

class Lobby {
    constructor(gameID) {
        this.agents = []
        this.gameSettings = this.gameSettings(gameID)
        this.game = null
    }

    addAgent(agentToken) {
        if (!this.agents.includes(agentToken)) {
            this.agents.push(agentToken)
            return true;
        }

        return false;
    }

    gameSettings(gameID) {
        const gameSettings = JSON.parse(fs.readFileSync(`./games/${gameID}/settings.json`))
        return gameSettings
    }

    startGame() {
        const game = new PaperScissorsRock(this.agents)
        game.main()
        return game
    }
}

export default Lobby