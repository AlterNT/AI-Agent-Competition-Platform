import commandExists from 'command-exists'
import child_process from 'child_process'
import yargs from 'yargs'

import API from './api.js'

const LANGUAGES = ['py', 'java']
const GAMES = ['paper-scissors-rock', 'love-letter']

const pathLookup = async (lookupList) => {
    for (const programName of lookupList) {
        try {
            await commandExists(programName)
            return programName
        } catch {}
    }

    throw new Error('None of options in path')
}

const getPythonPath = async () => {
    try {
        return await pathLookup(['python3', 'python'])
    } catch {
        throw new Error('Python not installed? Please check that `python3` or `python` is in path.')
    }
}

const getJavaPath = async () => {
    throw new Error('Java Agents Not Implemented Yet: Try Python Agents')
    try {
        return await pathLookup(['java'])
    } catch {
        throw new Error('Java not installed or not in path?')
    }
}

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
            try {
                fp = child_process.spawn(await getPythonPath(), ['./agents/python/main.py', token, game])
            } catch (pathError) {
                console.error(pathError)
                return
            }
            break
        case 'java':
            try {
                fp = child_process.spawn(await getJavaPath(), ['./agents/java/Main.java', token, game])
            } catch (pathError) {
                console.error(pathError)
                return
            }
            break
    }
    fp.stdout.on('data', (data) => {
        console.log(`${data}`)
    })
}

main()