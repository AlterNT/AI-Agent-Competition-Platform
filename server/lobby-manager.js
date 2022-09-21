import Lobby from './lobby.js';
import Server from './server.js';

class LobbyManager {

    /** @type {Object.<String, Lobby>} */
    lobbies = {};
    gameMap = {};
    lobbyMap = {};

    createLobby(lobbyID, gameID) {
        const lobby = new Lobby(gameID);
        this.lobbies[lobbyID] = lobby;
    }

    /**
     * Attempts to join the provided user to the specified lobby.
     * @param {String} agentToken 
     * @param {String} lobbyID 
     * @returns {Boolean} If the user successfully joined a lobby.
     */
    async joinLobby(agentToken, gameID, lobbyID = 0) {
        // Denies a player joining a lobby until their current game is over.
        const eligibility = await Server.instance.isUserEligibleToPlay(agentToken)
        if (!eligibility) {
            //return false;
        }

        const currentGame = this.gameMap[agentToken];
        if (currentGame) {
            if (!currentGame.result) {
                return false;
            } else {
                delete this.gameMap[agentToken];
            }
        }

        // Checks if the provided lobbyID exists and creates a new lobby if there isn't.
        if (this.lobbies[lobbyID] === undefined) {
            this.createLobby(lobbyID, gameID);
        }

        // Allows a player to leave a lobby after already joining one.
        const previousAllocation = this.lobbyMap[agentToken];
        if (previousAllocation) {
            previousAllocation.removeAgent(agentToken);
        }

        const lobby = this.lobbies[lobbyID];
        const success = lobby.addAgent(agentToken);

        console.log(`Player ${agentToken} successfully joined lobby ${lobbyID}! (${lobby.tokens.length}/${lobby.gameSettings.maxPlayers})`)

        // Starts the game once the lobby is full.
        if (lobby.tokens.length === lobby.gameSettings.maxPlayers) {
            const game = await lobby.startGame();

            for (const token of lobby.tokens) {
                this.gameMap[token] = game;
            }
            lobby.tokens.forEach((token) => {
                delete this.lobbyMap[token];
            })
            delete this.lobbies[lobbyID]
        }

        return { success, lobbyID };
    }

    action(agentToken, action) {
        if (!(agentToken in this.gameMap)) { return; }

        const game = this.gameMap[agentToken]

        if (!this.isTurn(agentToken)) { return; }

        game.turn = null;
        game.resolve(action);
    }

    runMethod(agentToken, keys, method, params) {
        if (!(agentToken in this.gameMap)) {
            return { error: 'game not started' };
        }

        const game = this.gameMap[agentToken];
        if (!this.isTurn(agentToken)) { return; }

        let object = game;
        keys.forEach((key) => object = object[key]);
        const data = object[method](...params);
        return data;
    }

    isTurn(agentToken) {
        if (agentToken in this.gameMap) {
            const game = this.gameMap[agentToken];
            return game.turn == agentToken;
        }

        return false;
    }
}

export default LobbyManager;