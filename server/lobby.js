import Server from "./server.js";

export default class Lobby {

    /** @type {Number} */
    id;
    /** @type {String[]} */
    players = [];
    /** @type {Number} */
    playerCapacity = Server.instance.Game.maxPlayers;
    /** @type {Number} */
    bots = 0;
    /** @type {Boolean} Disables automatic allocation to this lobby. */
    private = false;
    /** @type {Boolean} */
    debug = false;

    /**
     * Creates a new lobby with options.
     * @param {{
     *  maxAgents: Number,
     *  bots: Number,
     *  private: Boolean,
     *  debug: Boolean
     * }} options Lobby options.
     */
    constructor(id, options = {}) {
        this.id = id;
        // Only assign if it makes sense.
        if (options.maxAgents > Server.instance.Game.minPlayers && options.maxAgents <= Server.instance.Game.maxPlayers) {
            this.playerCapacity = options?.maxAgents ?? this.playerCapacity;
        }

        this.bots = options?.bots ?? this.bots;
        
        this.private = options?.private ?? this.private;

        this.debug = options?.debug ?? this.debug;
    }

    /**
     * Deletes and runs this lobby.
     */
    startLobby() {
        console.log(`Starting Lobby #${this.id}`);
        Server.instance.lobbyManager.startLobby(this.id, this.players, this.bots);
    }

    /**
     * @returns If the lobby is full.
     */
    isFull() {
        return this.players.length == this.playerCapacity;
    }

    /**
     * Adds a player to a lobby.
     * @param {String} token 
     */
    addPlayer(token) {
        this.players.push(token);
        console.log(`Agent ${token} assigned to lobby #${this.id} (${this.players.length}/${this.playerCapacity})`);
        if (this.isFull()) {
            this.startLobby()
        }
    }
}
