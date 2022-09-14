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
    constructor(server) {
        this.lobbyManager = new LobbyManager()
        this.server = server
    }

    run() {
        const app = express()
        app.use(bodyParser.json());
        app.listen(
            PORT,
            () => { console.log(`listening at http://localhost:${PORT}`) }
        )


        // ---------------------------------------------------------------
        // Historical Game Data (and Utilities)

        // returns all user/agent ids
        app.get('/api/agents', (_, res) => {
            this.server.getQueryResult(this.server.queryAgents)
                .then((agents) => {
                    res.json({agents});
                });
        });

        // returns all bot agents
        app.get('/api/bots', (_, res) => {
            this.server.getQueryResult(this.server.queryAgents, { studentNumber: this.Server.defaultAgentToken })
                .then((bots) => {
                    res.json({bots});
                });
        });

        // returns all games played
        app.get('/api/games', (_, res) => {
            this.server.getQueryResult(this.server.queryGames)
                .then((games) => {
                    res.json({games});
                });
        });

        // return all games for a given user
        app.get('/api/agent-games', (req, res) => {
            const { agentId } = req.query;
            this.server.getQueryResult(this.server.queryGames, { agentScores: agentId })
                .then((games) => {
                    res.json({games});
                });
        });

        // ---------------------------------------------------------------
        // Statistics (batch)
        // if no agents have played sufficient games this returns an empty list
        // @TODO: after tournament system we can look into rankings as well?

        // all agents sorted by winrate
        app.get('/api/top-winrate', (_, res) => {
            this.server.getQueryResult(this.server.queryTopWinrate)
                .then((winrate) => {
                    res.json({ winrate })
                });
        });

        // all agents sorted by which improved the most since its first game
        app.get('/api/most-improved', (_, res) => {
            this.server.getQueryResult(this.server.queryMostImproved)
                .then((improvement) => {
                    res.json({ improvement })
                });
        });

        // all the agents sorted by which improved the most in its past few games
        app.get('/api/most-improving', (_, res) => {
            // @TODO: implement the correct query for this
            this.server.getQueryResult(this.server.queryMostImproved)
                .then((improvement) => {
                    res.json({ improvement })
                });
        });

        // ---------------------------------------------------------------
        // game statistics: single agent
        // @TODO: implement by reusing cached batch query results

        // winrate of given agent
        // returns null if not enough games played
        app.get('/api/winrate', (req, res) => {
            const { agentId } = req.query;
            this.server.getQueryResult(this.server.queryTopWinrate, {agentId})
                .then((winrateArray) => {
                    const winrate = winrateArray?.[0] || null;
                    res.json({ winrate })
                });
        });

        // improvement of agent since its first game
        // returns null if not enough games played
        app.get('/api/improvement', (req, res) => {
            const { agentId } = req.query;
            this.server.getQueryResult(this.server.queryMostImproved, {agentId})
                .then((improvementArray) => {
                    const improvement = improvementArray?.[0] || null;
                    res.json({ improvement })
                });
        });

        // improvement of agent in its recent few games
        // returns null if not enough games played
        app.get('/api/improvement-rate', (req, res) => {
            const { agentId } = req.query;
            this.server.getQueryResult(this.server.queryMostImproved, {agentId})
                .then((improvementArray) => {
                    const improvement = improvementArray?.[0] || null;
                    res.json({ improvement })
                });
        });

        // ---------------------------------------------------------------
        // lobby management

        // @TODO: this should be a POST
        app.get('/client/join/:lobby', (req, _) => {
            const lobbyId = parseInt(req.params.lobby);
            const {token, ...options} = req.query;
            console.log(`Agent ${token} attempting to join lobby ${lobbyId === -1 ? '(auto)' : lobbyId}`);
            this.server.lobbyManager.joinLobby(lobbyId, token, options);
        })


        // GET ENDPOINTS
        // Specifically for gamestate, turn, and methods
        // ----------------------------------------------------------------------------
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