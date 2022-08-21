import { Client } from "./main"
import { error, log } from "./messages"
import fetch from 'node-fetch'
import readline from 'readline'


export default class ServerHandler {

    static serverAPI = 'http://localhost:8080/api';
    /**
     * requests a list of games to be played
     * @returns {} a list of available games
     */
    async games() {
        const response = await fetch(`${ServerHandler.serverAPI}/games`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const games = JSON.parse(response);
        return games;
    }

    /**
     * posts a request to join a lobby.
     * @param {String} gameID id of game to be played.
     * @param {Number} lobbyID id of lobby to join. -1 indicates automatic allocation.
     */
    async joinLobby(gameID, lobbyID = -1) {
        const response = await fetch(`${ServerHandler.serverAPI}/join-lobby`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: Client.instance.token,
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
        const response = await fetch(`${ServerHandler.serverAPI}/turn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: Client.instance.token,
            })
        });
        const turn = JSON.parse(response);
        return turn;
    }

    /**
     * requests the current game state for the agent
     */
    async gameState() {
        const response = await fetch(`${ServerHandler.serverAPI}/game-state`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: Client.instance.token
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
        const response = await fetch(`${ServerHandler.serverAPI}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: Client.instance.token,
                action: action
            })
        })
    }
}