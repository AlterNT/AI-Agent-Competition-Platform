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

    async startGame() {
        let gameClass = (await import(`./games/${Server.instance.config.games[this.gameID].path}`)).default;
        let agents = [];

        // Agent Proxy for logging.
        for (let token of this.tokens) {
            agents.push(new Proxy(
                new gameClass.Agent(token),
                {
                    apply: (methodName, _, args) => {
                        //TODO: EVENT SYSTEM.
                    }
                }
            ));
        }

        let game = new gameClass(agents, 0, fs.createWriteStream('./test.txt'));
        game.playGame();
        return game;
    }
}

export default Lobby;