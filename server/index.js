import Neode from 'neode';
import Models from './models/index.js';
import 'process';

class Server {
    constructor() {
        this.db_instance = Neode.fromEnv().with(Models);
    }

    /**
     * @TODO: Test
     * @param {String} agentToken
     */
    async getAgentGameState(agentToken) {
        const user = await this.db_instance.find(
            'User', agentToken
        );

        const agent = user.get('controls').endNode();
        const game = agent.get('currentGame').endNode();
        const gameJson = await game.toJson();

        return gameJson;
    }

    async handleClose() {
    }

    async run() {
    }
}

const server = new Server();
await server.run();
process.exit(0);
