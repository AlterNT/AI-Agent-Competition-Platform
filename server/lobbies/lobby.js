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
    /** @type {Number} How many players for this lobby to start. */
    slots;
    /** @type {Number} */
    bots = 0;
    /** @type {String} */
    password = '';
    /** @type {Boolean} */
    tournament = false;

    constructor(gameID, options) {
        this.bots = options?.bots ?? this.bots;
        this.gameSettings = config.games[gameID].settings;
        // Clamp slots to valid number.
        this.slots = Math.min(Math.max(options?.slots ?? this.gameSettings.maxPlayers, this.gameSettings.minPlayers), this.gameSettings.maxPlayers);
        console.log(this.slots)
        this.password = options?.password ?? this.password;
        this.tournament = options?.tournament ?? this.tournament;
        this.gameID = gameID;
    }

    /**
     * Adds agent tokens if they aren't already in the lobby.
     * @param {String} agentToken All tokens to be added.
     * @returns If the agent was added successfully.
     */
    addAgent(agentToken, password = '') {
        if (password === this.password && !this.tokens.includes(agentToken) && !this.isFull()) {
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
                                const eventObj = { event, args }
                                //LobbyManager.agentGame[token].events.push(eventObj)
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
        return (this.bots + this.tokens.length) === this.slots
    }
}

export default Lobby;