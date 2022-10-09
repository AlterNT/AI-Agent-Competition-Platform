import express from 'express'
import LobbyManager from './lobby-manager.js'
import Database from './database.js'
import config from './config.js';

class API {

    /** @type {import('express').Application} */
    static app;

    static port = 8080

    static async init() {
        const databaseDisabledError = { error: 'Database not implemented' };
        const incorrectQueryParamsError = { error: 'Incorrect query parameters' };
        const adminAuthError = { error: 'Lacking Admin Authentication' };
        const tokenAlreadyExistsError = { error: 'Token Already Exists' };

        this.app = express()
        const app = this.app

        app.use(express.json())

        // Allow CORS, everything should be application JSON
        // TODO: Test this doesn't break the bots
        app.use((req, res, next) => {
            res.header('Content-Type','application/json');
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');
            next();
        });

        // ---------------------------------------------------------------
        // Historical Game Data and Utilities

        // returns all user/agent ids
        app.get('/api/agents', (_, res) => {
            Database.getQueryResult(Database.queryAgents)
                .then((agents) => {
                    res.json({agents});
                });
        });

        // returns all bot agents
        app.get('/api/bots', (_, res) => {
            Database.getQueryResult(Database.queryAgents, { isBot: true })
            .then((bots) => {
                res.json({bots});
            });
        });

        // returns all games played
        app.get('/api/games', (req, res) => {
            let { page } = req.query;
            page = Number(page);

            if (!page || !Number.isInteger(page)) {
                const games = incorrectQueryParamsError;
                res.json({games});
                return;
            }

            Database.paginateGames(page)
                .then((result) => {
                    const games = result || databaseDisabledError;
                    res.json({games})
                });
        });

        // returns number of pages for the games query
        app.get('/api/count-game-pages', (_, res) => {
            Database.countPages()
                .then((numPages) => {
                    const pages = numPages || databaseDisabledError;
                    res.json({pages});
                });
        });

        app.post('/api/set-display-name', (req, res) => {
            const { studentNumber, displayName } = req.query;
            Database.setDisplayName(studentNumber, displayName)
                .then((success) => {
                    res.json({success});
                });
        });

        // returns a single game
        // TODO: update docs
        app.get('/api/game', (req, res) => {
            const { gameId } = req.query;
            Database.getQueryResult(Database.queryGames, { id: gameId })
            .then((games) => {
                res.json({games});
            });
        });

        // return all games for a given user
        app.get('/api/agent-games', (req, res) => {
            const { agentId } = req.query;
            Database.getQueryResult(Database.queryGames, { agentScores: agentId })
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
            Database.getQueryResult(Database.queryTopWinrate)
            .then((winrate) => {
                res.json({ winrate })
            });
        });

        // all agents sorted by which improved the most since its first game
        app.get('/api/most-improved', (_, res) => {
            Database.getQueryResult(Database.queryMostImproved)
            .then((improvement) => {
                res.json({ improvement })
            });
        });

        // all the agents sorted by which improved the most in its past few games
        app.get('/api/most-improving', (_, res) => {
            // @TODO: implement the correct query for this
            Database.getQueryResult(Database.queryMostImproved)
            .then((improvement) => {
                res.json({ improvement })
            });
        });

        // ---------------------------------------------------------------
        // Admin Routes
        // Changing display name can be done by admin as they can view student numbers

        // all agents sorted by which improved the most since its first game
        app.get('/api/check-admin', (req, res) => {
            const { adminToken } = req.query;
            if (!adminToken) {
                res.json({ authenticated: false });
            } else {
                Database.authenticateAdmin(adminToken)
                .then((authenticated) => {
                    res.json({ authenticated });
                })
            }
        });

        // all agents sorted by which improved the most since its first game
        app.get('/api/admin-view', (req, res) => {
            const { adminToken } = req.query;
            if (!adminToken) {
                res.json({ users: adminAuthError })
            } else {
                Database.authenticateAdmin(adminToken)
                    .then((authenticated) => {
                        if (!authenticated) {
                            res.json({ users: adminAuthError })
                        } else {
                            Database.getQueryResult(Database.queryAdminView)
                            .then((users) => {
                                res.json({ users })
                            });
                        }
                    });
            }
        });

        app.post('/api/generate-token', (req, res) => {
            let { adminToken, seed } = req.query;
            seed = Number(seed);
            if (!adminToken) {
                res.json({ token: adminAuthError });
            } else if (!seed || !Number.isInteger(seed)) {
                // seed must be a student number (integer)
                res.json({ token: incorrectQueryParamsError });
            } else {
                Database.authenticateAdmin(adminToken)
                    .then((authenticated) => {
                        if (!authenticated) {
                            res.json({ token: adminAuthError });
                        } else {
                            Database.generateUserTokens([seed], false)
                                .then((tokens) => {
                                    const token = tokens?.[0] || tokenAlreadyExistsError;
                                    res.json({ token });
                                });
                        }
                    });
            }
        });

        app.post('/api/generate-admin-token', (req, res) => {
            const { adminToken, seed } = req.query;
            if (!adminToken) {
                res.json({ token: adminAuthError });
            } else if (!seed) {
                res.json({ token: incorrectQueryParamsError });
            } else {
                Database.authenticateAdmin(adminToken)
                    .then((authenticated) => {
                        if (!authenticated) {
                            res.json({ token: adminAuthError });
                        } else {
                            Database.generateUserTokens([seed], true)
                                .then((tokens) => {
                                    const token = tokens?.[0] || tokenAlreadyExistsError;
                                    res.json({ token });
                                });
                        }
                    });
            }
        });

        // ---------------------------------------------------------------
        // game statistics: single agent
        // @TODO: implement by reusing cached batch query results

        // winrate of given agent
        // returns null if not enough games played
        app.get('/api/winrate', (req, res) => {
            const { agentId } = req.query;
            Database.getQueryResult(Database.queryTopWinrate, {displayName: agentId})
            .then((winrateArray) => {
                const winrate = winrateArray?.[0] || null;
                res.json({ winrate })
            });
        });

        // improvement of agent since its first game
        // returns null if not enough games played
        app.get('/api/improvement', (req, res) => {
            const { agentId } = req.query;
            Database.getQueryResult(Database.queryMostImproved, {displayName: agentId})
            .then((improvementArray) => {
                const improvement = improvementArray?.[0] || null;
                res.json({ improvement })
            });
        });

        // returns all available gameIDs to play.
        app.get('/api/available-games', (_, res) => {
            const gameIDs = Object.keys(config.games);
            res.json({ gameIDs });
        });

        // improvement of agent in its recent few games
        // returns null if not enough games played
        app.get('/api/improvement-rate', (req, res) => {
            const { agentId } = req.query;
            Database.getQueryResult(Database.queryMostImproved, {displayName: agentId})
            .then((improvementArray) => {
                const improvement = improvementArray?.[0] || null;
                res.json({ improvement })
            });
        });


        // ----------------------------------------------------------------------------
        // AGENT ENDPOINTS
        app.post('/api/authentication', (req, res) => {
            const agentToken = req.body.agentToken
            // TODO: check if token is in database
            const authorised = true
            res.json({ authorised })
        })

        // ---------------------------------------------------------------
        // game statistics: single agent
        // @TODO: implement by reusing cached batch query results

        app.get('/api/started', (req, res) => {
            const agentToken = req.query.agentToken;
            const gameStarted = LobbyManager.gameStarted(agentToken)
            res.json({ gameStarted })
        });

        app.get('/api/finished', (req, res) => {
            const agentToken = req.query.agentToken
            const gameFinished = LobbyManager.gameFinished(agentToken)
            res.json({ gameFinished })
        })

        app.get('/api/turn', (req, res) => {
            const agentToken = req.query.agentToken
            const isTurn = LobbyManager.isTurn(agentToken)
            res.json({ isTurn })
        })

        app.get('/api/state', (req, res) => {
            const agentToken = req.query.agentToken
            const state = LobbyManager.getState(agentToken)
            res.json({ state })
        })

        app.post('/api/action', (req, res) => {
            const { agentToken, action } = req.body
            const success = LobbyManager.action(agentToken, action)
            res.json({ success })
        })

        app.get('/api/method', (req, res) => {
            const { agentToken, keys, method, params } = req.body
            const result = LobbyManager.method(agentToken, keys, method, params)
            res.json({ result })
        })

        app.post('/api/join', async (req, res) => {
            const { agentToken, gameID, lobbyID, options } = req.body
            const result = await LobbyManager.joinLobby(agentToken, gameID, lobbyID, options);
            res.json(result);
        })

        return new Promise((resolve) => {
            app.listen(
                this.port,
                () => {
                    console.log(`listening at http://localhost:${this.port}`) 
                    resolve()
                }
            )
        })
    }
}

export default API;