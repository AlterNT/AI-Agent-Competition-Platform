import child_process from 'child_process'
import fetch from 'node-fetch'
import fs from 'fs'
import prompt from 'prompt-sync'
import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const input = prompt({ sigint: true });
const ACCEPTED_FILETYPES = ['py', 'java']

export default class AgentIO {
    /** @type {child_process.ChildProcess} */
    agent;

    /**
     * displays a list of agents in ./agents
     * user selects the agent they wish to use
     */
    loadAgent() {
        const agentsDIR = path.resolve(__dirname + '/agents')
        const agentFilenames = []

        /* TODO: This needs reworking as the agents folder is deprecated.

        for (const filename of fs.readdirSync('./agents')) {
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
        
        const agentIndex = parseInt(input('SELECT AGENT NUMBER: '))
        const agentFilepath = path.resolve(agentsDIR + '/' + agentFilenames[agentIndex])
        console.log(agentFilepath)

        this.executeAgent(agentFilepath)
        */
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

        // handle agent messages
        this.agent.stdout.on('data', (data) => {
            console.log(`${data}`)
        })

        // handle agent errors
        this.agent.stderr.on('data', (data) => {
            console.log(`${data}`)
        })
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
    }
}

const agentIO = new AgentIO()
agentIO.run()