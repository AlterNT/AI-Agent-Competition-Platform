import fs from 'fs'
import yaml from 'js-yaml'
import promptSync from 'prompt-sync'

import AgentIO from './agent-io.js'
import ServerHandler from './server-handler.js'

const prompt = promptSync()

async function main() {
    // load configuration file
    const config = yaml.load(fs.readFileSync('./CONFIG.yml'))
    const { agentToken } = config

    // initialise ServerHandler
    const serverHandler = new ServerHandler(agentToken)

    // select game
    const games = await serverHandler.games()

    for (const i in games) {
        console.log(`${i}. ${games[i]}`)
    }
    const gameIndex = parseInt(prompt('SELECT GAME NUMBER: '))
    const game = games[gameIndex]

    console.log() // for cleaner interface

    // initialise AgentIO
    const agentIO = new AgentIO(game)

    // select agent
    agentIO.loadAgent()


}

main()