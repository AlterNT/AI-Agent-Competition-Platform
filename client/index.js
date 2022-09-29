import child_process from 'child_process'
import yargs from 'yargs'

import API from './api.js'

const LANGUAGES = ['py', 'java']
const GAMES = ['paper-scissors-rock', 'love-letter']

async function main() {
    const argv = yargs(process.argv)
    .usage('Usage: $0 <options>')
    .option('token', {
        alias: 't',
        description: 'Agent authentication token',
        type: 'string',
        demandOption: true
    })
    .option('language', {
        alias: 'l',
        description: 'Language of agent',
        type: 'string',
        choices: LANGUAGES,
        demandOption: true
    })
    .option('game', {
        alias: 'g',
        description: 'Game to be played',
        type: 'string',
        choices: GAMES,
        demandOption: true
    })
    .help()
    .alias('help', 'h').argv

    const { token, language, game } = argv

    // checks if token is authorised
    // const authorised = await API.authenticate(token)
    // if (!authorised) { throw new Error(`unauthorised token: ${token}`) }

    // executes agent
    let fp
    switch (language) {
        case 'py':
            fp = child_process.spawn('python', ['./agents/python/main.py', token, game])
            break
        case 'java':
            fp = child_process.spawn('java', ['./agents/java/Main.java', token, game])
            break
    }
    fp.stdout.on('data', (data) => {
        console.log(`${data}`)
    })
}

main()