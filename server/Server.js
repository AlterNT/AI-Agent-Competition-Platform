import Neode from 'neode';
import Models from './models/index.js';
import LobbyManager from './lobby-manager.js';
import GameManager from './game-manager.js';
import PaperScissorsRock from './game/psr.js';
import 'process';
export default class Server {
    /** @type {Server} */
    static instance;

    /** @type {String} */
    static defaultAgentToken = 'defaultAgentToken';

    /** @type {LobbyManager} */
    lobbyManager;

    /** @type {[String]} */
    games;

    /** @type {typeof Game}} */
    Game = PaperScissorsRock;

    constructor() {
        if (Server.instance) {
            return Server.instance;
        }

        Server.instance = this;
        this.dbInstance = Neode.fromEnv().with(Models);
        this.lobbyManagers = {
            2: new LobbyManager(2, () => {}), // TODO: game manager and lobby start
            3: new LobbyManager(3, () => {}),
            4: new LobbyManager(4, () => {}),
        }
    }

    async deleteAll() {
        for (let label of Object.keys(Models)) {
            await this.dbInstance.deleteAll(label);
        }
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
     * @returns {Neode.Node<Models.Agent>}
     */
    async createUser(userToken, studentNumber) {
        return await this.dbInstance.create('User', {
                studentNumberString: String(studentNumber),
                authenticationTokenString: userToken,
        });
    }

    async createAgent(userToken, srcPath) {
        let user = await this.dbInstance.find('User', userToken)
        let agent = await this.dbInstance.create('Agent', {
            srcPath: srcPath,
        });

        await Promise.all([
            user.relateTo(agent, 'controls'),
            agent.relateTo(user, 'controls'),
        ]);
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

    async assignPlayerToLobby(userToken, numPlayers) {
        const lobbyManager = this.lobbyManagers[numPlayers]; // Check numPlayers exists in obj;
        lobbyManager.addPlayed(userToken);
    }

    async close() {
        this.dbInstance.close();
    }
}
