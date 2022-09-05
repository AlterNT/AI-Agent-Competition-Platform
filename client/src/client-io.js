import path from 'path'
import promptSync from 'prompt-sync'
import fs from 'fs'
import child_process from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const prompt = promptSync()

const ACCEPTED_FILETYPES = ['py', 'java']

class ClientIO {
    constructor(gameID) {
        this.gameID = gameID
        this.agent = null
    }

    loadAgent() {
        const gameDIR = path.join(__dirname + '/games' + '/' + this.gameID)
        const agentFilenames = []

        for (const filename of fs.readdirSync(gameDIR)) {
            for (const filetype of ACCEPTED_FILETYPES) {
                if (filename.endsWith(filetype)) {
                    agentFilenames.push(filename)
                }
            }
        }
        
        console.log('AGENTS: ')
        for (const i in agentFilenames) {
            console.log(`${i}. ${agentFilenames[i]}`)
        }
        
        const agentIndex = parseInt(prompt('SELECT AGENT NUMBER: '))
        const agentFilepath = path.join(gameDIR + '/' + agentFilenames[agentIndex])

        this.executeAgent(agentFilepath)
    }

    executeAgent(agentFilepath) {
        if (agentFilepath.endsWith('py')) {
            this.agent = child_process.spawn('python3', [agentFilepath])

        } else if (agentFilepath.endsWith('java')) {
            child_process.exec('javac', [agentFilepath])
            this.agent = child_process.spawn('java', [agentFilepath])
        }
    }

    clientIn(data) {
        console.log(`CLIENT-IN: ${data}`)
    }

    clientOut(data) {
        this.agent.stdin.write(`CLIENT-OUT: ${data}\n`)
    }
}

export default ClientIO

