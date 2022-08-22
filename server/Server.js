import Neode from 'neode';
import Models from './models/index.js';
import 'process';

class Server {
    constructor() {
        this.db_instance = Neode.fromEnv().with(Models);
    }

    /**
     * @return {Model} Game model
     */
    async createGame() {
        return await this.db_instance.create('Game', {});
    }

    /**
     * @TODO Test
     * @param {String} userToken
     * @param {String | Number} studentNumber
     */
    async createUser(userToken, studentNumber) {
        await this.db_instance.create('User', {
                studentNumberString: String(studentNumber), // dont know if this is legal?
                authenticationTokenString: userToken,
        });
    }

    /**
     * @TODO Test
     * @param {String} userToken
     * @return {Model} Agent model
     */
    async getUserAgent(userToken) {
        const user = await this.db_instance.find(
            'User', userToken
        );

        const agent = user.get('controls').endNode();
        return agent;
    }

    /**
     * @TODO Test
     * @param {String} userToken
     */
    async getUserGameState(userToken) {
        const agent = await this.getUserAgent(userToken);
        const game = agent.get('currentGame').endNode();
        const gameJson = await game.toJson();

        return gameJson;
    }

    /**
     * @TODO Test
     * @param {String} gameId
     */
    async addUserToLobby(userToken, gameId) {
        const agent = await this.getUserAgent(userToken);
        const game = await this.db_instance.find('Game', gameId);

        // Might need score to be set
        await Promise.all([
            agent.relateTo(game, 'playedIn'),
            agent.relateTo(game, currentGame),
            game.relateTo(agent, 'playedIn'),
        ])
    }

    /**
     * @TODO Use query builder to get all agents then detach currentGame
     * Maybe also delete the game node or just label it or something?
     * I think the best solution is to label all completed games instead
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
