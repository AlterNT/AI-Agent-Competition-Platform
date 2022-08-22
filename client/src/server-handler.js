import { Client } from "./main.js"
import fetch from 'node-fetch'


export default class ServerHandler {

    /** @type {String} */
    serverAddress = 'localhost';
    /** @type {Number} */
    port = 31415;

    serverAPI = `http://${this.serverAddress}:${this.port}/`;
    /**
     * requests a list of games to be played
     * @returns {} a list of available games
     */
    async games() {
        const response = await fetch(`${this.serverAPI}api/games`);
        const games = JSON.parse(response);
        return games;
    }

    /**
     * Joins a lobby on the server.
     * @param {{
     *  maxAgents: Number,
     *  bots: Number,
     *  private: Boolean
     * }} options Lobby options in the event that a new one is created.
     * @param {Number} lobbyId Lobby to be joined.
     * @returns {Number} The lobby joined.
     */
    async joinLobby(lobbyId = -1, options = {}) {
        const response = await fetch(`${this.serverAPI}client/join/${lobbyId}?${new URLSearchParams({
            token: Client.instance.token,
            ...options
        })}`);
        return parseInt(await response.text());
    }

    /**
     * requests the current game state for the agent
     */
    async gameState() {
        const response = await fetch(`${this.serverAPI}client/game`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: Client.instance.token
            })
        });
        const gameState = JSON.parse(await response.json());
        return gameState;
    }

    /**
     * posts an action made by the agent
     * @param {String} action action made by agent
     */
    async sendAction(action) {
        const response = await fetch(`${this.serverAPI}client/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: Client.instance.token,
                action: action
            })
        })
    }
}