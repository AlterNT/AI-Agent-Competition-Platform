import express from 'express'
import fs from 'fs'

const app = express()

app.listen(
    8080,
    () => { console.log('listening at http://localhost:8080') }
)

app.get('/games', (req, res) => {
    res.json(fs.readFileSync('./games.json', 'utf8'));
})

