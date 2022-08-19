import express from 'express'

const app = express()
app.listen(
    8080,
    () => { console.log('listening at http://localhost:8080') }
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


