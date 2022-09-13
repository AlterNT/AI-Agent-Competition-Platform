import express from 'express';
import Server from './server.js';

const runAPI = async () => {
    const server = new Server();
    const app = express()
    // TODO: Config would probably be a good idea for port.
    const PORT_NUMBER = 31415;

    app.listen(
        PORT_NUMBER,
        () => { console.log(`listening at http://localhost:${PORT_NUMBER}`) }
    )

    // ---------------------------------------------------------------
    // Historical Game Data (and Utilities)

    // returns all user/agent ids
    app.get('/api/agents', (_, res) => {
        server.getQueryResult(server.queryAgents)
            .then((agents) => {
                res.json({agents});
            });
    });

    // returns all bot agents
    app.get('/api/bots', (_, res) => {
        server.getQueryResult(server.queryAgents, { studentNumber: Server.defaultAgentToken })
            .then((bots) => {
                res.json({bots});
            });
    });

    // returns all games played
    app.get('/api/games', (_, res) => {
        server.getQueryResult(server.queryGames)
            .then((games) => {
                res.json({games});
            });
    });

    // return all games for a given user
    app.get('/api/agent-games', (req, res) => {
        const { agentId } = req.query;
        server.getQueryResult(server.queryGames, { agentScores: agentId })
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
        server.getQueryResult(server.queryTopWinrate)
            .then((winrate) => {
                res.json({ winrate })
            });
    });

    // all agents sorted by which improved the most since its first game
    app.get('/api/most-improved', (_, res) => {
        server.getQueryResult(server.queryMostImproved)
            .then((improvement) => {
                res.json({ improvement })
            });
    });

    // all the agents sorted by which improved the most in its past few games
    app.get('/api/most-improving', (_, res) => {
        // @TODO: implement the correct query for this
        server.getQueryResult(server.queryMostImproved)
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
        server.getQueryResult(server.queryTopWinrate, {agentId})
            .then((winrateArray) => {
                const winrate = winrateArray?.[0] || null;
                res.json({ winrate })
            });
    });

    // improvement of agent since its first game
    // returns null if not enough games played
    app.get('/api/improvement', (req, res) => {
        const { agentId } = req.query;
        server.getQueryResult(server.queryMostImproved, {agentId})
            .then((improvementArray) => {
                const improvement = improvementArray?.[0] || null;
                res.json({ improvement })
            });
    });

    // improvement of agent in its recent few games
    // returns null if not enough games played
    app.get('/api/improvement-rate', (req, res) => {
        const { agentId } = req.query;
        server.getQueryResult(server.queryMostImproved, {agentId})
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
        server.lobbyManager.joinLobby(lobbyId, token, options);
    })

    // ---------------------------------------------------------------
    // game logic

    // return gamestate view for agent
    app.get('/client/game', (req, res) => {
        const { agentToken } = req.params

        res.json();
    });

    // receive move played by an agent
    app.post('/client/action', (req, res) => {
        const { agentToken, action } = req.params;
    });
}

export default runAPI;
