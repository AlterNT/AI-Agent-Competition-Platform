import fs from 'fs'
import PaperScissorsRock from './games/paper-scissors-rock/paper-scissors-rock.js'
import LoveLetter from './games/love-letter/love-letter.js'

class Lobby {
    constructor(gameID) {
        this.gameID = gameID
        this.agents = []
        this.gameSettings = this.gameSettings(gameID)
    }

    addAgent(agentToken) {
        if (!this.agents.includes(agentToken)) {
            this.agents.push(agentToken)
            return true;
        }

        return false;
    }

    removeAgent(agentToken) {
        this.agents = this.agents.filter((token) => token !== agentToken);
    }

    gameSettings() {
        const gameSettings = JSON.parse(fs.readFileSync(`./games/${this.gameID}/settings.json`))
        return gameSettings
    }

    startGame() {
        let game = null
        if (this.gameID == 'paper-scissors-rock') {
            game = new PaperScissorsRock(this.agents)
        }

        if (this.gameID == 'love-letter') {
            game = new LoveLetter(this.agents)
        }

        game.main()
        return game
    }
}

export default Lobby