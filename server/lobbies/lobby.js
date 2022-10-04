import fs from 'fs';
import config from '../config.js';
import LobbyManager from '../lobby-manager.js';

class Lobby {

    /** @type {[String]} Array of agent tokens. */
    tokens = [];
    /** @type {String} ID of game. */
    gameID;
    /** @type {{maxPlayers: Number, minPlayers: Number}} Settings of current game. */
    gameSettings;
    /** @type {Number} */
    bots;

    constructor(gameID, options) {
        this.bots = options.bots ?? 0;
        this.gameID = gameID;
        this.gameSettings = config.games[gameID].settings;
    }

    /**
     * Adds agent tokens if they aren't already in the lobby.
     * @param {String} agentToken All tokens to be added.
     * @returns If the agent was added successfully.
     */
    addAgent(agentToken) {
        if (!this.tokens.includes(agentToken) && !this.isFull()) {
            this.tokens.push(agentToken);
            return true;
        }
        return false;
    }

    removeAgent(agentToken) {
        this.tokens = this.tokens.filter((token) => token !== agentToken);
    }

    async initGame() {
        let gameClass = (await import(`../games/${config.games[this.gameID].path}`)).default;
        let agents = [];

        // Agent Proxy for logging.
        for (let token of this.tokens) {
            agents.push(new Proxy(
                new gameClass.Agent(token),
                {
                    get: (target, event, _) => {
                        if (typeof target[event] == 'function') {
                            return (...args) => {
                                // Agent method called.
                                const clonedArgs = JSON.parse(JSON.stringify(args))
                                const eventObj = { token, event, clonedArgs }
                                LobbyManager.agentGame[token].events.push(eventObj)
                                //target.events.push(eventObj)
                                return target[event](...args)
                            }
                        } else {
                            // Return the property accessed.
                            return target[event]
                        }
                        
                    }
                }
            ));
        }

        let game = new gameClass(agents, 0, fs.createWriteStream('./test.txt'));
        return game;
    }

    isFull() {
        console.log(this.bots)
        return (this.bots + this.tokens.length) === this.gameSettings.maxPlayers
    }
}

export default Lobby;