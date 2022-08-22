import { Client } from './main';
import child_process from 'child_process';
import { logError, error } from './messages';

export default class AgentIO {

    /** @type {child_process.ChildProcess} */
    agent;

    /* Deprecated?
        Maybe we could add an autodetect specifically for python and java.


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
    */
    
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
     * Recieves data from the agent.
     * @param {String} raw Data recieved.
     */
    agentOut(raw) {
        let data = JSON.parse(raw);
        // TODO: Send to server-handler.
    }

    /**
     * Sends data to the agent.
     * @param {{*}} data Data to be sent.
     */
    agentIn(data) {
        if (agent === undefined) {
            error('Agent is undefined!');
        }

        this.agent.stdin.write(data);
    }
}