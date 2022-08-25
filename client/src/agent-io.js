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

class AgentIO {
    constructor(game) {
        this.game = game
        this.agent = null
    }

    loadAgent() {
        const gameDIR = path.join(__dirname + '/games' + '/' + this.game)
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
            this.agent = child_process.spawn('python', [agentFilepath])

        } else if (agentFilepath.endsWith('java')) {
            child_process.exec('javac', [agentFilepath])
            this.agent = child_process.spawn('java', [agentFilepath])
        }

        this.agent.stdout.on('data', (data) => {
            console.log(`${data}`)
        })
    }
}

export default AgentIO

