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
            const turn = this.lobbyManager.isTurn(agentToken)
            res.json({ turn })
        })

        app.get('/api/method', (req, res) => {
            const { agentToken, keys, method, params } = req.body
            const data = this.lobbyManager.method(agentToken, keys, method, params)
            res.json({ data })
        })

        // GET ENDPOINTS
        // Specifically for accessing State, Action and Card Modal.
        // ----------------------------------------------------------------------------

        // to see if given action is legal
        app.get('/api/state/legalAction', (req, res) => {
            const { agentToken, target, card } = req.body;
            const isLegalAction = 0; // need to create methods to find players game to get state so it can be used as a checker
            res.json({isLegalAction});
        })

        // so player can draw the top card off the top of the deck.
        app.get('/api/state/getCard', (req, res) => {
            const { agentToken } = req.body;
            const getCard = 0; // create new method to access a given palyers lobby and return getCard() function from the lobbyies state controller
            res.json({getCard});
        })

        // create action for player
        // redundant - can be included within the game logic server side
        // would require player to return a (card & target) pair for playCard rather that a action object
        app.get('/api/action/create', (req, res) => {
            const {agentToken, target, card, guess} = req.body
            const action = 0
            res.json({action})
        })

        // POST ENDPOINTS
        // ----------------------------------------------------------------------------
        app.post('/api/join', (req, res) => {
            const { agentToken, gameID } = req.body
            const success = this.lobbyManager.joinLobby(agentToken, gameID)
            res.json({ success })
        })

        app.post('/api/action', (req, res) => {
            const { agentToken, action } = req.body
            this.lobbyManager.action(agentToken, action)
            res.json({ success: true })
        })
    }
}

export default API