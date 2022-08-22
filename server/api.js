import express from 'express';
import Server from './server.js';

const runAPI = async () => {
    // TODO: Not sure about having the server not being the first thing initialized.
    // Refactor?
    const server = new Server();
    const app = express()
    // TODO: Config would probably be a good idea for port.
    const PORT_NUMBER = 31415;

    app.listen(
        PORT_NUMBER,
        () => { console.log(`listening at http://localhost:${PORT_NUMBER}`) }
    )

    // return list of available games to be played
    app.get('/api/games', (req, res) => {
        res.json()
    })

    // return gamestate view for agent
    app.get('/client/game', (req, res) => {
        const { agentToken } = req.params

        res.json()
    })

    app.get('/client/join/:lobby', (req, res) => {
        const lobbyId = parseInt(req.params.lobby);
        const {token, ...options} = req.query;
        console.log(`Agent ${token} attempting to join lobby ${lobbyId === -1 ? '(auto)' : lobbyId}`);
        server.lobbyManager.joinLobby(lobbyId, token, options);
    })

    // receive move played by an agent
    app.post('/client/action', (req, res) => {
        const { agentToken, action } = req.params;
    })
}

export default runAPI;
