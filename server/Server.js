import Neode from 'neode';
import Models from './models/index.js';
import LobbyManager from './lobby-manager.js';
import GameManager from './game-manager.js';
import Game from './game/game.js';
import PaperScissorsRock from './game/psr.js';
import API from './api.js';

export default class Server {
    /** @type {Server} */
    static instance;


    /** @type {API} */
    api = new API();
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
        if (Server.instance) {
            return Server.instance;
        }

        Server.instance = this;
    }

    /**
     * Drops every instance of every label from the db
     */
    async deleteAll() {
        await Promise.all(Object.keys(Models).map((label) => this.dbInstance.deleteAll(label)));
    }

    /**
     * @returns {Neode.Node<Models.User>}
     */
    async getDefaultUser() {
        const defaultAgent = await this.dbInstance.find('User', Server.defaultAgentToken);
        if (defaultAgent) {
            return defaultAgent;
        }

        const user = await this.createUser(Server.defaultAgentToken, '000000');
        const agent = await this.dbInstance.create('Agent', {
            srcPath: '???',
        });


        await Promise.all([
            user.relateTo(agent, 'controls'),
            agent.relateTo(user, 'controls'),
        ]);

        return await this.dbInstance.find('User', Server.defaultAgentToken);
    }

    /**
     * Creates the default user if they do not exist
     * @returns {Neode.Node<Models.Agent>}
     */
    async getDefaultAgent() {
        const user = await this.getDefaultUser();
        const agent = user.get('controls').endNode();
        return agent;
    }

    /**
     * @returns {Neode.Node<Models.Game>}
     */
    async createGameNode() {
        return await this.dbInstance.create('Game', {});
    }

    /**
     * @TODO Test
     * @param {String} userToken
     * @param {String | Number} studentNumber
     * @returns {Neode.Node<Models.User>}
     */
    async createUser(userToken, studentNumber) {
        return await this.dbInstance.create('User', {
                studentNumberString: String(studentNumber),
                authenticationTokenString: userToken,
        });
    }

    /**
     * @param {Neode.Node<Models.User>} user
     * @param {String} srcPath
     * @returns {Neode.Node<Models.Agent>}
     */
    async createAgent(user, srcPath) {
        let agent = await this.dbInstance.create('Agent', {
            srcPath: srcPath,
        });

        await Promise.all([
            user.relateTo(agent, 'controls'),
            agent.relateTo(user, 'controls'),
        ]);

        return await this.dbInstance.find('Agent', agent.id());
    }

    /**
     * @TODO Test
     * @param {String} userToken
     * @return {Neode.Node<Models.Agent> | null} Agent model
     */
    async getUserAgent(userToken) {
        const user = await this.dbInstance.find(
            'User', userToken
        );

        const edge = user.get('controls');
        if (!edge) {
            return null;
        }

        const agent = edge.endNode();
        return agent;
    }

    /**
     * @TODO Test
     * @param {String} userToken
     * @return {Neode.Node<Models.Game>[]}
     */
    async getUserGames(userToken) {
        const agent = await this.getUserAgent(userToken);
        const games = agent.get('playedIn').endNode();

        return games;
    }

    /**
     * Only a user with a valid agent can play
     * Returns whether they have a valid agent
     * @param {String} userToken
     * @return {Boolean}
     */
    async isUserEligibleToPlay(userToken) {
        return !!await this.getUserAgent(userToken);
    }

    /**
     * Creates agent <-> game edges in the db
     * @param {String[]} userTokens
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
