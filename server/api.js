import express from 'express';
import Server from './server.js';

export default class API {

    /** @type {Express} */
    app = express();

    constructor() {
        // TODO: Config would probably be a good idea for port.
        const PORT_NUMBER = 31415;

        this.app.listen(
            PORT_NUMBER,
            () => { console.log(`listening at http://localhost:${PORT_NUMBER}`) }
        )

        // return list of available games to be played
        this.app.get('/api/games', (req, res) => {
            res.json()
        })

        // return gamestate view for agent
        this.app.get('/client/game', (req, res) => {
            const { agentToken } = req.params

            res.json()
        })

        this.app.get('/client/join/:lobby', (req, res) => {
            const lobbyId = parseInt(req.params.lobby);
            const {token, ...options} = req.query;
            console.log(`Agent ${token} attempting to join lobby ${lobbyId === -1 ? '(auto)' : lobbyId}`);
            Server.instance.lobbyManager.joinLobby(lobbyId, token, options);
        })

        // receive move played by an agent
        this.app.post('/client/action', (req, res) => {
            const { agentToken, action } = req.params;
        })
    }
}
