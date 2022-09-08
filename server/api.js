import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import LobbyManager from './lobby-manager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 8080

class API {
    constructor() {
        this.lobbyManager = new LobbyManager()
    }

    run() {
        const app = express()
        app.use(bodyParser.json());
        app.listen(
            PORT,
            () => { console.log(`listening at http://localhost:${PORT}`) }
        )


        // GET ENDPOINTS
        // ----------------------------------------------------------------------------
        app.get('/api/games', (req, res) => {
            const gamesDIR = path.join(__dirname + '/games')
            const games = fs.readdirSync(gamesDIR)

            res.json(games)
        })

        app.get('/api/state', (req, res) => {
            const { agentToken } = req.query
            res.json({ gamestate: "gamestate" })
        })

        app.get('/api/turn', (req, res) => {
            const { agentToken } = req.query
            const turn = this.lobbyManager.isTurn(agentToken);
            res.json({ turn })
        })

        app.get('/api/method', (req, res) => {
            const { agentToken, keys, method, params } = req.body
            console.log(agentToken, keys, method, params)
            const data = this.lobbyManager.method(agentToken, keys, method, params)
            res.json({ data })
        })


        // POST ENDPOINTS
        // ----------------------------------------------------------------------------
        app.post('/api/join', (req, res) => {
            const { agentToken, gameID } = req.body
            const success = this.lobbyManager.joinLobby(agentToken, gameID)
            res.json({ success })
        })

        app.post('/api/action', (req, res) => {
            const { agentToken, action } = req.body;
            this.lobbyManager.action(agentToken, action);
            res.json({ success: true })
        })
    }
}

export default API