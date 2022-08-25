import Lobby from './lobby.js';

class LobbyManager {
    constructor() {
        this.lobbies = []
    }

    addAgent(agentToken, gameID) {
        console.log(agentToken, gameID)
        let lobby = null

        if (this.lobbies.length == 0) {
            lobby = new Lobby(agentToken, gameID)
        }
    }
}

export default LobbyManager