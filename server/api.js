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
    // map db nodes

    // @TODO: returns all games played
    app.get('/api/games', (_, res) => {
        res.json();
    });

    // @TODO: returns all users
    app.get('/api/users', (_, res) => {
        res.json();
    });

    // @TODO: returns all agents
    app.get('/api/agents', (_, res) => {
        res.json();
    });

    // returns all bot agents
    app.get('/api/bots', (_, res) => {
        server.queryBotAgents()
            .then((result) => {
                res.json(result);
            });
    });

    // @TODO: returns all agents controlled by a non-bot user
    app.get('/api/user-agents', (_, res) => {
        res.json();
    });


    // @TODO: returns all agents for a user
    app.get('/api/agents-of-user', (req, res) => {
        const { studentNumber } = req.params;
        server.queryUserAgents(studentNumber) // @TODO: implement arg
            .then((result) => {
                res.json(result);
            });
    });

    // ---------------------------------------------------------------
    // get historical game data

    // @TODO: returns all games for a given user
    app.get('/api/user-games', (req, res) => {
        const { agentId } = req.params;
        res.json();
    });

    // @TODO: returns last x games for a given user
    app.get('/api/user-recent-games', (req, res) => {
        const { agentId, lookbehind } = req.params;
        res.json();
    });

    // @TODO: returns last x games played by a bot
    app.get('/api/user-recent-games', (req, res) => {
        const { lookbehind } = req.params;
        res.json();
    });

    // @TODO: returns all bot games
    app.get('/api/bot-games', (req, res) => {
        res.json();
    });

    // @TODO: returns all games for an agent
    app.get('/api/agent-games', (req, res) => {
        const { studentNumber } = req.params;
        res.json();
    });

    // ---------------------------------------------------------------
    // game statistics: batch
    // if no agents have played sufficient games this returns an empty list 
    // @TODO: after tournament system we should have a ranking API as well

    // @TODO: all agents sorted by winrate
    // @TODO: bots flag to specify whether only bots should return
    app.get('/api/top-winrate', (_, res) => {
        res.json();
    });

    // @TODO: all agents sorted by who's improved the most
    // @TODO: bots flag to specify whether only bots should return
    app.get('/api/most-improved', (_, res) => {
        res.json();
    });

    // @TODO: all the agents sorted by who's improving the quickest
    // @TODO: bots flag to specify whether only bots should return
    app.get('/api/most-improving', (_, res) => {
        res.json();
    });

    // ---------------------------------------------------------------
    // game statistics: single agent
    // @TODO: implement by reusing cached batch query results

    // @TODO: winrate of given agent
    // @TODO: returns nothing if not enough games were played
    app.get('/api/winrate', (req, res) => {
        const { agentId } = req.params;
        res.json();
    });

    // @TODO: improvement of given agent
    // @TODO: returns nothing if not enough games were played
    app.get('/api/overall-improvement', (req, res) => {
        const { agentId } = req.params;
        res.json();
    });

    // @TODO: recent improvement of given agent
    // @TODO: returns nothing if not enough games were played
    app.get('/api/recent-improvement', (req, res) => {
        const { agentId } = req.params;
        res.json();
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

        res.json()
    })

    // receive move played by an agent
    app.post('/client/action', (req, res) => {
        const { agentToken, action } = req.params;
    })
}

export default runAPI;
