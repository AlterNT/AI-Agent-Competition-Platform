import Lobby from './lobby.js';

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

export default class LobbyManager {

    /** @type {Map<Number, Lobby>} */
    lobbies = new Map();

    /**
     * @param {Number} id Lobby id. If this does not exist, one will be created. If this is -1, one will be auto-assigned.
     * @returns {Lobby} Allocated lobby.
     */
    getLobby(id) {
        let lobby;

        if (id === -1) {
            // Automatic allocation.
            // Join the first not-full lobby.
            for (let l of this.lobbies.values()) {
                if (!l.isFull()) {
                    lobby = l;
                    break;
                }
            }
            // If all lobbies are full.
            if (lobby === undefined) {
                lobby = new Lobby();
                let newId = 0;
                // Find the first unused id.
                while (this.lobbies.has(newId)) newId++;
                this.lobbies.set(newId, lobby);
            }
        } else {
            // Join lobby if it exists, otherwise create a new one.
            if (this.lobbies.has(id)) {
                lobby = this.lobbies.get(id);
            } else {
                lobby = new Lobby();
                this.lobbies.set(id, lobby);
            }
        }

        return lobby;
    }

    // end lobby 

    // notify lobby address of updates 

    // remove player 

    // handle and monitor disconnection

}