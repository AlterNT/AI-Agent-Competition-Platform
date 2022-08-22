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

class LobbyManager {
    constructor(numPlayers, startGame) {
        this.startGame = startGame;
        this.createLobby();

        /** @type {String[]} array of user tokens */
        this.queue = [];

        /** @type {Number} array of user tokens */
        this.numLobbies = 10;

        /** @type {Number} array of user tokens */
        this.numPlayers = numPlayers;
    }

    async createLobby() {
        /** @type {Lobby[]} array of available lobbies */
        this.lobby = new Lobby(this.numPlayers, 2, this.startLobby);
    }

    async connectPlayer() {
        this.lobby.registerPlayer();
    }

    async startLobby() {
        // TODO: Dispatch game
        this.createLobby();
    }

    async addPlayer(id){
        this.lobby.registerPlayer(id);
    }
}
