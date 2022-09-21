import fs from 'fs';
import PaperScissorsRock from './games/paper-scissors-rock/paper-scissors-rock.js';
import LoveLetter from './games/love-letter/love-letter.js';
import Server from './server.js';
import IGame from './games/i-game.js';

class Lobby {

    /** @type {[String]} Array of agent tokens. */
    tokens = [];
    /** @type {String} ID of game. */
    gameID = Server.instance.config.currentGame;
    /** @type {{}} Settings of current game. */
    gameSettings = Server.instance.config.games[this.gameID].settings;
    /** @type {typeof(IGame)} The current game to be run. */
    Game;

    /**
     * Adds agent tokens if they aren't already in the lobby.
     * @param {String} agentToken All tokens to be added.
     * @returns If the agent was added successfully.
     */
    addAgent(agentToken) {
        if (!this.tokens.includes(agentToken)) {
            this.tokens.push(agentToken);
            return true;
        }
        return false;
    }

    removeAgent(agentToken) {
        this.tokens = this.tokens.filter((token) => token !== agentToken);
    }

    gameSettings() {
        const gameSettings = JSON.parse(fs.readFileSync(`./games/${this.gameID}/settings.json`));
        return gameSettings;
    }

    async startGame() {
        this.Game = (await import(`./games/${Server.instance.config.games[this.gameID].path}`)).default;
        let agents = []
        // TODO: Stub.
        for (let token in this.tokens) {
            agents.push(new this.Game.Bot(token))
        }

        return new this.Game(agents);
    }
}

export default Lobby;