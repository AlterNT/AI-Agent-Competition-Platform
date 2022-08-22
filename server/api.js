import express from 'express';
import Server from './Server.js';

const runAPI = async () => {
    const server = new Server();
    const app = express()
    const PORT_NUMBER = 8080;

    let game = await server.createGame();
    console.log(game);

    app.listen(
        PORT_NUMBER,
        () => { console.log(`listening at http://localhost:${PORT_NUMBER}`) }
    )

    // return list of available games to be played
    app.get('/api/games', (req, res) => {
        res.json()
    })

    // return gamestate view for agent
    app.get('api/game', (req, res) => {
        const { agentToken } = req.params

        res.json()
    })

    // receive move played by an agent
    app.post('api/game', (req, res) => {
        const { agentToken } = req.params
    })
}

export default runAPI;
