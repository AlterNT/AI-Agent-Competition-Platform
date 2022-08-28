import express from 'express';
import Server from './server.js';

export default class API {

    /** @type {Express} */
    app = express();

    constructor() {
        // TODO: Config would probably be a good idea for port.
        // TODO: Refactor into server.js
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
            let { token } = req.params

            // Testing clause.
            if (token === 'DEBUG') {
                // Use ip address to identify unique DEBUG agents.
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
                // TODO: This is a patchwork solution. Maybe look into making it an option?
                token += '-' + ip;
            }

            res.json()
        })

        this.app.get('/client/join/:lobby', (req, res) => {
            const lobbyId = parseInt(req.params.lobby);
            let {token, ...options} = req.query;

            // Testing clause.
            if (token === 'DEBUG') {
                // Use ip address to identify unique DEBUG agents.
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
                // TODO: This is a patchwork solution. Maybe look into making it an option?
                token += '-' + ip;
            }

            console.log(`Agent ${token} attempting to join lobby ${lobbyId === -1 ? '(auto)' : lobbyId}`);
            Server.instance.lobbyManager.joinLobby(lobbyId, token, options);
        })

        // receive move played by an agent
        this.app.post('/client/action', (req, res) => {
            let { token, action } = req.params;

            // Testing clause.
            if (token === 'DEBUG') {
                // Use ip address to identify unique DEBUG agents.
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
                // TODO: This is a patchwork solution. Maybe look into making it an option?
                token += '-' + ip;
            }
        })
    }
}
