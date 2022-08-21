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
    constructor(lobbyAddress){
        //this.name = "Lobby Manager";
        this.lobbyAddress = lobbyAddress;
        this.lobby = new Lobby();
    }    
    async startLobby(){
        // !!!!!ADD call back function to time out after given time and and start game with random agents
        while (this.lobby.isFull() != true){
            // add sleep function
            console.log("Game: %s\n Is waiting for a game to start, current player count: %s", this.lobbyAddress,this.queue.length);
        }
        // lobby has been filled 
        // hand lobby over to game handler 
    }

    // end lobby 

    async addPlayer(id){
        this.lobby.registerPlayer(id);
    }

    // notify lobby address of updates 

    // remove player 

    // handle and monitor disconnection
    
}

  var Lobby = new LobbyManager("/api/a");
  Lobby.startLobby();