import express from 'express'
var app = express();

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

// Create server variable to be stored and notify user of API activation.
var server = app.listen(8080, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("REST API Listening at http://%s:%s", host, port)
})