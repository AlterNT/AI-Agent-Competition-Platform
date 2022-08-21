import { Client } from "./main"
import { error, log } from "./messages"
import fetch from 'node-fetch'
import readline from 'readline'

const SERVER_API_ENDPOINT = 'http://localhost:8080/api'

export default class ServerHandler {
    constuctor(agentToken) {
        this.serverAPI = SERVER_API_ENDPOINT
        this.agentToken = agentToken
    }

    /**
     * requests a list of games to be played
     * @returns {} a list of available games
     */
    games() {
        const response = await fetch(`${this.serverAPI}/games`) 
        const games = JSON.parse(response)
        return games
    }

    /**
     * posts a request to join a lobby
     * @param {string} gameID id of game to be played
     */
    joinLobby(gameID) {
        const response = await fetch(`${this.serverAPI}/join-lobby`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                agentToken: agentToken,
                gameID: gameID
            }
        })
    }

    /**
     * requests the agentToken of current agents turn 
     * @returns {} agentToken of current agents turn
     */
    turn() {
        const response = await fetch(`${this.serverAPI}/turn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                agentToken: agentToken,
            }
        }) 
        const turn = JSON.parse(response)
        return turn
    }

    /**
     * requests the current game state for the agent
     */
    gameState() {
        const response = await fetch(`${this.serverAPI}/game-state`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                agentToken: agentToken
            }
        })
        const gameState = JSON.parse(response)
        return gameState
    }

    /**
     * posts an action made by the agent
     * @param {String} action action made by agent
     */
    sendAction(action) {
        const response = await fetch(`${this.serverAPI}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                agentToken: agentToken,
                action: action
            }
        })
    }
}