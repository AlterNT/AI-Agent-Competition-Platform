import express from 'express'
import bodyParser from 'body-parser'

import LobbyManager from './lobby-manager.js'
import Server from './server.js'

const PORT = 8080

class API {

    run() {
        let host = Server.instance.config.host;
        let port = Server.instance.config.port;

        const app = express()
        app.use(bodyParser.json());
        app.listen(
            port,
            () => { console.log(`Listening at http://${host}:${port}!`) }
        );


        // ---------------------------------------------------------------
        // Historical Game Data (and Utilities)

        // returns all user/agent ids
        app.get('/api/agents', (_, res) => {
            Server.instance.getQueryResult(Server.instance.queryAgents)
                .then((agents) => {
                    res.json({agents});
                });
        });

        // returns all bot agents
        app.get('/api/bots', (_, res) => {
            Server.instance.getQueryResult(Server.instance.queryAgents, { studentNumber: Server.instance.defaultAgentToken })
                .then((bots) => {
                    res.json({bots});
                });
        });

        // returns all games played
        app.get('/api/games', (_, res) => {
            Server.instance.getQueryResult(Server.instance.queryGames)
                .then((games) => {
                    res.json({games});
                });
        });

        // returns a single game
        // TODO: update docs
        app.get('/api/game', (req, res) => {
            const { gameId } = req.query;
            Server.instance.getQueryResult(Server.instance.queryGames, { id: gameId })
                .then((games) => {
                    res.json({games});
                });
        });

        // return all games for a given user
        app.get('/api/agent-games', (req, res) => {
            const { agentId } = req.query;
            Server.instance.getQueryResult(Server.instance.queryGames, { agentScores: agentId })
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
            Server.instance.getQueryResult(Server.instance.queryTopWinrate)
                .then((winrate) => {
                    res.json({ winrate })
                });
        });

        // all agents sorted by which improved the most since its first game
        app.get('/api/most-improved', (_, res) => {
            Server.instance.getQueryResult(Server.instance.queryMostImproved)
                .then((improvement) => {
                    res.json({ improvement })
                });
        });

        // all the agents sorted by which improved the most in its past few games
        app.get('/api/most-improving', (_, res) => {
            // @TODO: implement the correct query for this
            Server.instance.getQueryResult(Server.instance.queryMostImproved)
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
            Server.instance.getQueryResult(Server.instance.queryTopWinrate, {agentId})
                .then((winrateArray) => {
                    const winrate = winrateArray?.[0] || null;
                    res.json({ winrate })
                });
        });

        // improvement of agent since its first game
        // returns null if not enough games played
        app.get('/api/improvement', (req, res) => {
            const { agentId } = req.query;
            Server.instance.getQueryResult(Server.instance.queryMostImproved, {agentId})
                .then((improvementArray) => {
                    const improvement = improvementArray?.[0] || null;
                    res.json({ improvement })
                });
        });

        // improvement of agent in its recent few games
        // returns null if not enough games played
        app.get('/api/improvement-rate', (req, res) => {
            const { agentId } = req.query;
            Server.instance.getQueryResult(Server.instance.queryMostImproved, {agentId})
                .then((improvementArray) => {
                    const improvement = improvementArray?.[0] || null;
                    res.json({ improvement })
                });
        });

        app.get('/api/turn', (req, res) => {
            const { agentToken } = req.query;
            const turn = Server.instance.lobbyManager.isTurn(agentToken);
            res.json({ turn });
        });

        app.get('/api/method', (req, res) => {
            const { agentToken, keys, method, params } = req.body;
            const data = Server.instance.lobbyManager.runMethod(agentToken, keys, method, params);
            res.json({ data })
        })

        // POST ENDPOINTS
        // ----------------------------------------------------------------------------
        app.post('/api/join', (req, res) => {
            const { agentToken, lobbyID } = req.body
            Server.instance.lobbyManager
                .joinLobby(agentToken, lobbyID)
                .then((success) => {
                    res.json({ success })
                });
        })

        app.post('/api/action', (req, res) => {
            const { agentToken, action } = req.body;
            Server.instance.lobbyManager.action(agentToken, action);
            res.json({ success: true });
        });
    }
}

export default API;