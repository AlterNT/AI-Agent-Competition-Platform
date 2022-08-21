import express from 'express'
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.json())

// return list of available games to be played
app.get('/api/games', (req, res) => {
    // would ideally be able to do this dynamically (not have to use a json file that must be editted)
    res.json()
})

// Create server variable to be stored and notify user of API activation.
const server = app.listen(8080, () => {
    const host = server.address().address
    const port = server.address().port
    console.log("REST API Listening at http://%s:%s", host, port)
})