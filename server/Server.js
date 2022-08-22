import Neode from 'neode';
import Models from './models/index.js';
import LobbyManager from './lobby-manager.js';
import GameManager from './game-manager.js';
import Game from './game/game.js';
import PaperScissorsRock from './game/psr.js';

export default class Server {
    /** @type {Server} */
    static instance;

    /** @type {Neode} */
    //dbInstance = Neode.fromEnv().with(Models);
    /** @type {LobbyManager} */
    lobbyManager = new LobbyManager();
    /** @type {GameManager} */
    gameManager = new GameManager();

    //TODO? How will this work. Config file?
    /** @type {[String]} */
    games;

    /** @type {typeof Game}} */
    Game = PaperScissorsRock;

    constructor() {
        // TODO: Singleton maybe?
        Server.instance = this;
    }

    /**
     * @return {Model} Game model
     */
    async createGameNode() {
        return await this.dbInstance.create('Game', {});
    }

    /**
     * @TODO Test
     * @param {String} userToken
     * @param {String | Number} studentNumber
     */
    async createUser(userToken, studentNumber) {
        await this.dbInstance.create('User', {
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
        const user = await this.dbInstance.find(
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
        const game = await this.createGameNode();

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
        this.dbInstance.close();
    }
}
