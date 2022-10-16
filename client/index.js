import chalk from 'chalk'
import commandExists from 'command-exists'
import child_process from 'child_process'
import yargs from 'yargs'
import path from 'path'


import API from './api.js'
import { syncBuiltinESMExports } from 'module'

const LANGUAGES = ['py', 'java']
const GAMES = ['paper-scissors-rock', 'love-letter']
var compiled = false

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
        return await pathLookup(['python', 'python3'])
    } catch {
        throw new Error('Python not installed? Please check that `python3` or `python` is in path.')
    }
}

const getJavaPath = async () => {
    try {
        return await pathLookup(['java'])
    } catch {
        throw new Error('Java not installed or not in path?')
    }
}

const compileMaven = async () => {
    try {
        if(process.platform == "win32"){
        let cmd = child_process.spawn('cmd.exe', ['/c', 'mavenCompileScript\\compileMaven.bat'])
        } else if (process.platform == 'darwin') {
            return null
        } else if (process.platform == 'linux'){
            return null
        }
    } catch {
        throw new Error('Couldnt compile maven project')
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
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
    .option('compile', {
        alias: 'c',
        description: "Flag for whether the java client needs to be compiled",
        type: 'boolean'
    })
    .help()
    .alias('help', 'h').argv

    const { token, language, game, compile } = argv

    // checks if token is authorised
    // const authorised = await API.authenticate(token)
    // if (!authorised) { throw new Error(`unauthorised token: ${token}`) }

    // executes agent
    let fp
    switch (language) {
        case 'py':
            try {
                fp = child_process.spawn(await getPythonPath(), ['-u', './agents/python/main.py', token, game])
            } catch (pathError) {
                console.error(pathError)
                return
            }
            break
        case 'java':
            if(compile === true){
                try {
                    let compile = await compileMaven()
                    console.log("compiling java client")
                    await sleep(10000);
                } catch (error) {
                    console.log(error)
                }
            }

            try {
                console.log(await getJavaPath())
                fp = child_process.spawn(await getJavaPath(), ['-jar', './agents/java/client/target/client-1.0-SNAPSHOT-jar-with-dependencies.jar', token, game])
            } catch (pathError) {
                console.error(pathError)
                return
            }
            break
    }
    fp.stdout.on('data', (data) => {
        console.log(`${data}`)
    })

    fp.stderr.on('data', (data) => {
        console.log(chalk.red(`${data}`))
    })
}


main()