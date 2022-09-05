import Lobby from './lobby.js';

const MAX_PLAYERS = 4

class LobbyManager {
    constructor() {
        this.lobbies = {}
        this.agentMap = {}
    }

    createLobby(gameID) {
        const lobby = new Lobby(gameID)
        this.lobbies[gameID] = lobby
    }

    joinLobby(agentToken, gameID) {
        // checks if there is a lobby for this game and creates one if there isnt
        if (this.lobbies[gameID] == undefined) {
            this.createLobby(gameID)
        }

        const lobby = this.lobbies[gameID]
        lobby.addAgent(agentToken)

        if (lobby.agents.length == lobby.gameSettings.maxPlayers) {
            const lobby = this.lobbies[gameID]
            const game = lobby.startGame()
            game.main()
            for (const agent of lobby.agents) {
                this.agentMap[agent] = game
            }
            delete this.lobbies[gameID]
        }
    }

    commitAction(agentToken, move) {
        if (!(agentToken in this.agentMap)) {
            return;
        };
        const game = this.agentMap[agentToken];
        game.resolve(move)
        console.log(game);
    }
}

export default LobbyManager