import Neode from 'neode';
import Models from './models/index.js';
import 'process';

class Server {
    constructor() {
        this.db_instance = Neode.fromEnv().with(Models);
    }

    /**
     * @TODO: Test
     * @param {String} userToken
     * @param {String | Number} studentNumber
     */
    async createUser(userToken, studentNumber) {
        await this.db_instance.create(
            'User', {
                studentNumberString: String(studentNumber), // dont know if this is legal?
                authenticationTokenString: userToken,
        });
    }

    /**
     * @TODO: Test
     * @param {String} userToken
     */
    async getAgentGameState(userToken) {
        const user = await this.db_instance.find(
            'User', userToken
        );

        const agent = user.get('controls').endNode();
        const game = agent.get('currentGame').endNode();
        const gameJson = await game.toJson();

        return gameJson;
    }

    /**
     * @TODO: Test
     * @param {String} gameId
     */
    async addAgentToLobby(gameId) {
    }

    /**
     * @TODO: Test
     * @param {String} gameId
     */
    async closeLobby(gameId) {
    }

    async handleClose() {
        this.db_instance.close();
    }

    async run() {
        try {
            // @TODO
        } catch (exception) {
            // @TODO
        } finally {
            this.handleClose();
        }
    }
}

const server = new Server();
await server.run();
process.exit(0);
