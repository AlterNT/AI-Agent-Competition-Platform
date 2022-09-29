import fs from 'fs';
import Config from '../config.js';

class Lobby {

    /** @type {[String]} Array of agent tokens. */
    tokens = [];
    /** @type {String} ID of game. */
    gameID;
    /** @type {{}} Settings of current game. */
    gameSettings;
    /** @type {{}} Lobby options. */
    options;

    constructor(gameID, options) {
        this.options = options;
        this.gameID = gameID;
        this.gameSettings = Config.games[gameID].settings;
    }

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

    async initGame() {
        let gameClass = (await import(`../games/${Config.games[this.gameID].path}`)).default;
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
        return game;
    }
}

export default Lobby;