import { Client } from './main'
import child_process from 'child_process'
import { logError, error } from './messages'
import fetch from 'node-fetch'

const ACCEPTED_FILETYPES = ['py', 'java']

export default class AgentIO {
    /** @type {child_process.ChildProcess} */
    agent;

    /**
     * Initializes the agent to be run and registers relevant events.
     * @param {String} agentCommand 
     */
    createAgent(agentCommand) {
        agent = child_process.spawn(agentCommand);

        subprocess.on('error', (err) => {
            console.error(logError('Agent exception occurred.', err));
            if (Client.instance.isCLI) process.exit(1);
        });

        agent.stdout.on('data', (data) => {
            this.agentOut(data);
        });
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

        // handle agent messages
        this.agent.stdout.on('data', (data) => {
            this.agentOut(data)
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
}