import fetch from 'node-fetch'

const SERVER_API_ENDPOINT = 'http://localhost:8080/api'

class ServerHandler {
    constructor(agentToken) {
        this.agentToken = agentToken
        this.serverAPI = SERVER_API_ENDPOINT
    }

    async games() {
        const response = await fetch(`${this.serverAPI}/games`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const games = await response.json()
        return games
    }

    async state() {
        const response = await fetch(`${this.serverAPI}/state?agentToken=${this.agentToken}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const state = await response.json()
        return state
    }

    async turn() {
        const response = await fetch(`${this.serverAPI}/turn?agentToken=${this.agentToken}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const turn = await response.json()
        return turn
    }

    async joinLobby() {
        const response = await fetch(`${this.serverAPI}/join`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: this.agentToken
            })
        })
    }

    async sendAction(action) {
        const response = await fetch(`${this.serverAPI}/action`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agentToken: this.agentToken,
                action: action
            })
        })
    }
}

export default ServerHandler