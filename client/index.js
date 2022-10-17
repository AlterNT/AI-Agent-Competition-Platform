import chalk from 'chalk'
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
/**
 * Function used to create a new terminal process instance and compile the maven project dependant on the processes operating system
 */
const compileMaven = async () => {
    try {
        if(process.platform == "win32"){
            let cmd = child_process.spawn('cmd.exe', ['/c', 'mavenCompileScripts\\compileMaven.bat'])
        } else if (process.platform == 'darwin' || process.platform == 'linux') {
            let cmd = child_process.exec('mavenCompileScripts/compiler.sh')
        } else {
            throw new Error('This system architecture is not supported aswell ')
        }
    } catch {
        throw new Error('Couldnt compile maven project')
    }
}

/**
 * Function used to stop processing of Node to wait for the Maven Java Compilation run course.
 *
 * @param {*} ms time to wait in milliseconds
 * @returns {Promise} a new promise that stops excution until timeout is fufilled
 */
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
    .option('url', {
        alias: 'u',
        Description: 'Url of the host server',
        type: 'string',
        demandOption: true
    })
    .help()
    .alias('help', 'h').argv

    const { token, language, game, compile, url } = argv

    // checks if token is authorised
    // const authorised = await API.authenticate(token)
    // if (!authorised) { throw new Error(`unauthorised token: ${token}`) }

    // executes agent
    let fp
    switch (language) {
        case 'py':
            try {
                fp = child_process.spawn(await getPythonPath(), ['-u', './agents/python/main.py', token, game, url])
            } catch (pathError) {
                console.error(pathError)
                return
            }
            break

        case 'java':
            // Checks to see if the java project needs to be recompiled
            // sets timeout through sleep function to wait for compilation
            if(compile === true){
                try {
                    let compile = await compileMaven()
                    console.log("compiling java client")
                    // EDIT THE BELOW INPUT PARAMETER TO CHANGE
                    // THE AMOUNT OF TIME WAITED FOR COMPILATION
                    await sleep(10000);
                } catch (error) {
                    console.log(error)
                }
            }
            // Creates new process of the compiled java project with the given token and game-id
            try {
                console.log(await getJavaPath())
                fp = child_process.spawn(await getJavaPath(), ['-jar', './agents/java/client/target/client-1.0-SNAPSHOT-jar-with-dependencies.jar', token, game, url])
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