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

app.get('api/getLobby', (req, res) => {
    // check if there is active waiting lobbys.

    // add player to joinable lobbys through the lobbys manager if possible.

    // if no joinable lobbys.

    // generate psuedo random 8 character string.

    // create new api route string.

    // create new route. 

    // redirect user to the new route that will be managed by the lobby manager.
})
