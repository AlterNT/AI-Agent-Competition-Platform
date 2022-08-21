const path = require('path')
const prompt = require('prompt-sync')({ sigint: true })
const fs = require('fs')
const child_process = require('child_process')

const ACCEPTED_FILETYPES = ['py', 'java']
export default class AgentIO {
    constructor() {
        this.agent = null
    }

    /**
     * displays a list of agents in ./agents
     * user selects the agent they wish to use
     */
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

    /**
     * executes the agent that was select in loadAgent()
     * @param {String} agentFilepath 
     */
    executeAgent(agentFilepath) {
        if (agentFilepath.endsWith('py')) {
            this.agent = child_process.spawn('python', [agentFilepath])

        } else if (agentFilepath.endsWith('java')) {
            child_process.exec('javac', [agentFilepath])
            this.agent = child_process.spawn('java', [agentFilepath])
        }
    }

    /**
     * recieves data from the agent
     * @param {String} raw data recieved
     */
    agentOut(raw) {
        const data = JSON.parse(raw);
        // TODO: Send to server-handler.
    }

    /**
     * sends data to the agent
     * @param {String} data data to be sent
     */
    agentIn(data) {
        if (agent === undefined) {
            error('Agent is undefined!');
        }

        this.agent.stdin.write(data);
    }

    run() {
        this.loadAgent()

        // handle agent messages
        this.agent.stdout.on('data', (data) => {
            this.agentOut(data)
        })

        // handle agent errors
        this.agent.stderr.on('data', (data) => {
            console.log(`${data}`)
        })
    }
}