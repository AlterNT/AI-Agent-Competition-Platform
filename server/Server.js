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

        // TODO: create Agent
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
     * @return {Model[]} Game models
     */
    async getUserGames(userToken) {
        const agent = await this.getUserAgent(userToken);
        const games = agent.get('playedIn').endNode();

        return games;
    }

    /**
     * @TODO Test
     * @param {String} gameId
     */
    async recordGame(userTokens) {
        const game = await this.createGame();

        for (let userToken of userTokens) {
            // Might need score to be set
            const agent = await this.getUserAgent(userToken);
            await Promise.all([
                agent.relateTo(game, 'playedIn'),
                game.relateTo(agent, 'playedIn'),
            ]);
        }
    }

    async close() {
        this.db_instance.close();
    }
}

export default Server;
