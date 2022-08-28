// LobbyManager contains instances of Lobby classes which contain instances of player classes.

// - = Client interaction
// LobbyManager contains instances of Lobby classes which contain instances of player classes.

// - = Client interaction 
// -> = server side interaction

// - CLient requests game
// -> API Redirect to pseudo random game lobby (/game/7xdE4f)
//			LobbyManager instance started
//			creates lobby instances
//			creates player instance
//			keeps queue of active games

//-> Lobby manager sets call back for timeout
//			hand over to game client with random agnets of occurs

//-> Lobby manager waits and checks lobby to see if they have 4x player instances


// - client request game
// -> API check to see if there is active waiting lobbys
//	      if so add player to lobby through lobby manager function
//	      if not request new lobby from lobby manager.
//			LobbyManager instance started 
//			creates lobby instances 
//			creates player instance 
//			keeps queue of active games

//-> Lobby manager sets call back for timeout 
//			hand over to game client with random agnets of occurs

//-> Lobby manager waits and checks lobby to see if they have 4x player instances 


// - client request game
// -> API check to see if there is active waiting lobbys 
//	      if so add player to lobby through lobby manager function 
//	      if not request new lobby from lobby manager.

import Lobby from './lobby.js';
import Server from './server.js';

export default class LobbyManager {

    /** @type {Map<Number, Lobby>} */
    lobbies = new Map();

    /**
     * Adds a player to a lobby.
     * @param {Number} lobbyId The requested lobby id. -1 for automatic allocation.
     * @param {String} token The player's token.
     * @param {
     *  maxAgents: Number,
     *  bots: Number,
     *  private: Boolean
     * } options The options to be used if a new lobby is created.
     * @returns {Number} The assigned lobby id.
     */
    joinLobby(lobbyId, token, options) {
        let id;

        if (lobbyId === -1) {
            // Automatic allocation.
            // Join the first not-full, not-private lobby.
            for (let [i, l] of this.lobbies) {
                if (!l.isFull() && !l.private) {
                    id = i;
                    l.addPlayer(token);
                    break;
                }
            }
            // If all lobbies are full or there are none.
            if (id === undefined) {
                id = 0;
                // Find the first unused id.
                while (this.lobbies.has(id)) id++;
                let lobby = new Lobby(id, options);
                lobby.addPlayer(token);
                this.lobbies.set(id, lobby);
            }
        } else {
            id = lobbyId;
            // Join lobby if it exists, otherwise create a new one.
            if (this.lobbies.has(lobbyId)) {
                let lobby = this.lobbies.get(lobbyId);
                lobby.addPlayer(token);
            } else {
                let lobby = new Lobby(id, options);
                lobby.addPlayer(token);
                this.lobbies.set(id, lobby);
            }
        }

        return id;
    }

    /**
     * Starts the game in a lobby.
     * @param {Number} lobbyId 
     * @param {String[]} players List of player tokens.
     * @param {Number} bots Number of bots to be added.
     */
    async startLobby(lobbyId, players, bots) {
        await Server.instance.gameManager.createGame(players, bots);
        this.lobbies.delete(lobbyId);
    }

}
