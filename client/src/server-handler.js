import fetch from 'node-fetch'

const SERVER_API_ENDPOINT = 'http://localhost:8080/api'

export default class ServerHandler {
    constructor(agentToken) {
        this.severAPI = SERVER_API_ENDPOINT
        this.agentToken = agentToken
    }

    /**
     * requests a list of games to be played
     * @returns {} a list of available games
     */
    async games() {
        const response = await fetch('http://localhost:8080/api/games', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const games = await response.json()

        return games;
    }

    /**
     * posts a request to join a lobby.
     * @param {String} gameID id of game to be played.
     * @param {Number} lobbyID id of lobby to join. -1 indicates automatic allocation.
     */
    async joinLobby(gameID, lobbyID = -1) {
        const response = await fetch('http://localhost:8080/api/join-lobby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: this.agentToken,
                gameID: gameID,
                lobbyID: lobbyID
            })
        })
    }

    /**
     * requests the agentToken of current agents turn 
     * @returns {} agentToken of current agents turn
     */
    async turn() {
        const response = await fetch(`${this.serverAPI}/turn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: agentToken,
            })
        });
        const turn = JSON.parse(response);
        return turn;
    }

    /**
     * requests the current game state for the agent
     */
    async gameState() {
        const response = await fetch(`${this.serverAPI}/game-state`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: agentToken
            })
        });
        const gameState = JSON.parse(response);
        return gameState;
    }

    /**
     * posts an action made by the agent
     * @param {String} action action made by agent
     */
    async sendAction(action) {
        const response = await fetch(`${this.serverAPI}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: agentToken,
                action: action
            })
        });
    }
}

async function main() {
    const sh = new ServerHandler("AGENT_TOKEN")
    await sh.games()
    await sh.joinLobby("GAME_ID")
    await sh.turn()
    await sh.sendAction("ACTION")
    await sh.gameState()
}

main()