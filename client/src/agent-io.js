const path = require('path')
const prompt = require('prompt-sync')({ sigint: true })
const fs = require('fs')
const child_process = require('child_process')

const ACCEPTED_FILETYPES = ['py', 'java']
const SERVER_API_ENDPOINT = 'http://localhost:8080/api'
class AgentIO {
    constructor() {
        this.agent = null
        this.serverAPI = SERVER_API_ENDPOINT
    }

    loadAgent() {
        const agentsDIR = path.resolve(__dirname + '/agents')
        const agentFilenames = []

        for (const filename of fs.readdirSync(agentsDIR)) {
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
        const agentFilepath = path.resolve(agentsDIR + '/' + agentFilenames[agentIndex])

        this.executeAgent(agentFilepath)
    }

    executeAgent(agentFilepath) {
        let agent = null

        if (agentFilepath.endsWith('py')) {
            agent = child_process.spawn('python', [agentFilepath])

        } else if (agentFilepath.endsWith('java')) {
            child_process.exec('javac', [agentFilepath])
            agent = child_process.spawn('java', [agentFilepath])
        }

        this.agent = agent

        agent.stdout.on('data', (data) => {
            console.log(`${data}`)
        })

        agent.stderr.on('data', (data) => {
            console.log(`${data}`)
        })
    }

    run() {
        this.loadAgent()
    }
}

const agentIO = new AgentIO()
agentIO.run()