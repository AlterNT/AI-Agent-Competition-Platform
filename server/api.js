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
            res.json({ turn: agentToken })
        })


        // POST ENDPOINTS
        // ----------------------------------------------------------------------------
        app.post('/api/join', (req, res) => {
            const { agentToken, gameID } = req.body
            this.lobbyManager.joinLobby(agentToken, gameID)
        })


        app.post('/api/action', (req, res) => {
            const { agentToken, action } = req.body
        })
    }
}

export default API