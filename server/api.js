import express from 'express';

/**
 * @param {Server} server
 */
const runAPI = async (server) => {
    const app = express()
    const PORT_NUMBER = 8080;

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

    app.get('join', (req, res) => {
        const { agentToken } = req.params
        server.assignPlayerToLobby(agentToken, 4);
    })

    // receive move played by an agent
    app.post('api/game', (req, res) => {
        const { agentToken } = req.params
    })
}

export default runAPI;
