import chalk from 'chalk';
import fs from 'fs';
import Neode from 'neode';

import Models from './models/index.js';
import TokenGenerator from './token-generator.js';
import DBSync from './db-sync.js';
import Config from './config.js';

class Neo4jDatabase {
    /** @type {[String]} */
    static defaultAgentToken = '00000000';
    static dbInstance
    static dbSync

    static async init() {
        /** @type {Neode} */
        this.dbInstance = new Neode(
            `${Config.database.protocol}://${Config.database.host}:${Config.database.port}`,
            Config.database.username,
            Config.database.password
        ).with(Models);

        const batchQueries = [
            this.queryGames,
            this.queryAgents,
            this.queryTopWinrate,
            this.queryMostImproved,
        ];

        const timeoutDurationMilliseconds = 4_000;

        /** @type {DBSync} */
        this.dbSync = new DBSync();
        await this.dbSync.start(batchQueries, timeoutDurationMilliseconds);
    }

    /**
     * Returns whatever has been cached for the result of the query
     * @param {Function | String} query
     * @param {{ any } | undefined | null} filters (strict) equalities applied on the resulting object
     * @returns {any}
     */
    static async getQueryResult(query, filters) {
        return await this.dbSync.getQueryResult(query, filters || {});
    }

    static async loadTestData() {
        const numAgents = 8;
        const gamesPerAgent = 2;
        const agentsPerGame = 4;
        const numGames = numAgents * gamesPerAgent;

        console.log('Cleaning Database...');
        await this.deleteAll();

        console.log('Initializing default agent...');
        await this.getDefaultAgent();

        console.log('Generating User Data...');
        const studentNumbers = [...new Array(numAgents)].map((_, i) => String(10000 * i + 20000000));

        const tokengen = new TokenGenerator();
        const userData = tokengen.computeStudentTokens(studentNumbers);

        console.log('Creating Users and Agents...');
        await Promise.all(userData.map((
            { studentNumber, authToken }) => this.createUserAndAgent(studentNumber, authToken)
        ));

        console.log('Creating Games');
        const gameRecordings = [];
        for (let i = 0; i < numGames; i++) {
            // pick 5 without replacement
            const usersInGame =  [...studentNumbers]
                .sort(() => 0.5 - Math.random())  // shuffle
                .slice(0, agentsPerGame);

            const userScores = {};
            usersInGame.forEach((token, i) => {
                userScores[token] = i == 0 ? 1.0 : 0.0;
            });

            const promise = this.recordGame(userScores);
            gameRecordings.push(promise);
        }

        await Promise.all(gameRecordings);
        console.log('Finished');

        return;
    }

    /**
     * Drops every instance of every label from the db
     */
    static async deleteAll() {
        await Promise.all(Object.keys(Models).map((label) => this.dbInstance.deleteAll(label)));
    }

    /**
     * @returns {Neode.Node<Models.User>}
     */
    static async getDefaultUser() {
        const defaultAgent = await this.dbInstance.find('User', Database.defaultAgentToken);
        if (defaultAgent) {
            return defaultAgent;
        }

        const user = await this.createUser(Database.defaultAgentToken, '000000');
        const agent = await this.dbInstance.create('Agent', {
            srcPath: '???',
        });

        await Promise.all([
            user.relateTo(agent, 'controls'),
            agent.relateTo(user, 'controls'),
        ]);

        return await this.dbInstance.find('User', Database.defaultAgentToken);
    }

    /**
     * Creates the default user if they do not exist
     * @returns {Neode.Node<Models.Agent>}
     */
    static async getDefaultAgent() {
        const user = await this.getDefaultUser();
        const agent = user.get('controls').endNode();
        return agent;
    }

    /**
     * @returns {Neode.Node<Models.Game>}
     */
    static async createGameNode() {
        return await this.dbInstance.create('Game', {});
    }

    /**
     * @param {String} userToken
     * @param {String | Number} studentNumber
     * @returns {Neode.Node<Models.User>}
     */
    static async createUser(studentNumber, userToken) {
        return await this.dbInstance.create('User', {
            studentNumber: String(studentNumber),
            authToken: userToken,
        });
    }

    /**
     * @param {Neode.Node<Models.User>} user
     * @param {String} srcPath
     * @returns {Neode.Node<Models.Agent>}
     */
    static async createAgent(user, srcPath) {
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
     * @param {String | Number} studentNumber
     * @param {String} authToken
     * @returns {Neode.Node<Models.Agent>}
     */

    static async createUserAndAgent(studentNumber, authToken) {
        const user = await this.createUser(studentNumber, authToken);
        const agent = await this.createAgent(user, '/code');

        return agent;
    }

    /**
     * @param {String} userToken
     * @return {Neode.Node<Models.Agent> | null} Agent model
     */
    static async getUserAgent(userToken) {
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
     * @param {String} userToken
     * @return {Neode.Node<Models.Game>[]}
     */
    static async getUserGames(userToken) {
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
    static async isUserEligibleToPlay(userToken) {
        const user = await this.dbInstance.find(
            'User', userToken
        );

        return !!user && !!await this.getUserAgent(userToken);
    }

    /**
     * Creates agent <-> game edges in the db
     * @param {{ userToken: String, score: Number}} gameOutcome
     */
    static async recordGame(gameOutcome) {
        const game = await this.createGameNode();

        const relationMappings = [];
        for (const [ userToken, score ] of Object.entries(gameOutcome)) {
            // Might need score to be set
            const agent = await this.getUserAgent(userToken);
            const agentRelation = agent.relateTo(game, 'playedIn', { score });
            const gameRelation = game.relateTo(agent, 'playedIn', { score });

            relationMappings.push(agentRelation);
            relationMappings.push(gameRelation);
        }

        await Promise.all(relationMappings);
    }

    /**
     * Generates and assigns a token for each student number in the file
     * One student number should be present on each line
     * @param {String} studentNumbersFilePath string containing the file path of the student numbers file
     * @returns {{studentNumber: String, authToken: String}[]} an array of objects with the last token generated at the last index
     */
    static async generateUserTokens(studentNumbersFilePath) {
        let studentNumbersFileContent;
        try {
            studentNumbersFileContent = fs.readFileSync(studentNumbersFilePath)
                .toString();
        } catch (exception) {
            console.error(`Cannot read specified file, please check permission and location\n${exception}`);
            return [];
        }

        const studentNumbers = studentNumbersFileContent
            .trim()
            .split('\n');

        const tokengen = new TokenGenerator();
        const studentData = tokengen.computeStudentTokens(studentNumbers);
        const userData = [];

        for (const { studentNumber, authToken } of studentData) {
            const user = await this.dbInstance.find(
                'User', studentNumber
            );

            if (!user) {
                await this.createUserAndAgent(studentNumber, authToken);
                userData.push({ studentNumber, authToken });
            }
        }

        return userData;
    }

    /**
     * @return {any[]} array of all games
     */
    static async queryGames() {
        const res = await this.dbInstance.all('Game')
        return res.map((_, i) => {
            const game = res.get(i);
            const agentEdges = game.get('playedIn');
            const agentScores = {};
            agentEdges.map((_, i) => {
                const agentEdge = agentEdges.get(i);
                const agentId = agentEdge.startNode().get('id');
                const score = agentEdge.properties().score.toFixed(2);

                agentScores[agentId] = score;
            });

            return {
                ...game.properties(),
                agentScores,
            }
        });
    }

    /**
     * @TODO remove token from users
     * @return {any[]} array of all user and agents id
     */
    static async queryAgents() {
        const res = await this.dbInstance.all('User')
        const allUsers = res.map((_, i) => {
            const user = res.get(i);
            const agentId = user.get('controls')?.endNode()?.get('id');
            const { studentNumber } = user.properties();

            return {
                studentNumber,
                agentId,
            };
        });

        const usersWithAgent = allUsers.filter(({ agentId }) => agentId);
        return usersWithAgent;
    }

    /**
     * finds the highest WR agent with a min number of games.
     * @TODO maybe this should be top 10 agents?
     * @return {any[]} array of single, most improved agent
     */
    static async queryTopWinrate() {
        const res = await this.dbInstance.cypher(`
            MATCH (a:Agent)-[p:PLAYED_IN]-> (g:Game)
            WITH a, count(g) AS GamesPlayed, collect(p.score) AS scores
            WITH a, GamesPlayed, size([i in scores WHERE i=1| i]) AS Wins
            RETURN a.id as AgentId, GamesPlayed, Wins, 100 * Wins/GamesPlayed AS WinPercent
            ORDER BY WinPercent DESC;
        `);

        return res.records.map((record) => ({
            agentId: record.get('AgentId').toString(),
            gamesPlayed: record.get('GamesPlayed').toInt(),
            wins: record.get('Wins').toInt(),
            winPercent: record.get('WinPercent').toNumber().toFixed(2),
        }));
    }

    /**
     * Finds the most improved agents comparing past performance to recent performance
     * @return {any[]} list of agents and improvements sorted by most improved
     */
    static async queryMostImproved() {
        const res = await this.dbInstance.cypher(`
            MATCH (a:Agent)-[p:PLAYED_IN]-> (g:Game)
            WITH a, collect(p.score) as Scores, apoc.coll.sortNodes(collect(g), 'timePlayed') as Games
            WITH a, Scores[0..5] as FFGS, Scores[-5..] as LFGS, Games[0..5] as FFG, Games[-5..] as LFG
            WITH a,
                size(FFG) as FFGSize, size(LFG) as LFGSize,
                size([i in FFGS WHERE i=1]) as FFGWins,
                size([i in LFGS WHERE i=1]) as LFGWins
            WITH a,
                100 * FFGWins/FFGSize as InitialWinPercent,
                100 * LFGWins/LFGSize as LastWinPercent
            RETURN a.id as AgentId,
                InitialWinPercent,
                LastWinPercent,
                LastWinPercent - InitialWinPercent as PercentageImprovement
            ORDER BY PercentageImprovement DESC
            LIMIT 10;
        `);

        return res.records.map((record) => ({
            agentId: record.get('AgentId').toString(),
            initialWinPercent: record.get('InitialWinPercent').toInt(),
            lastWinPercent: record.get('LastWinPercent').toInt(),
            percentageImproved: record.get('PercentageImprovement').toInt(),
        }));
    }


    /**
     * @TODO agent param
     * @param {string} agentId
     * @return {any[]} All games of specified agent
     */
    static async queryAgentGames() {
        const res = await this.dbInstance.cypher(`
            MATCH (a:Agent)-[:PLAYED_IN]->(g:Game)
            WHERE a.id = "c2f75e6e-b25c-41dd-9f7d-31375e0a129c"
            RETURN a as Agent, g as Games;
        `);

        return res.records.map((record) => record.get('Games').toString());
    };

    /**
     * @param {String} agentId
     * @return {any[]} winrate of all agents
     */
    static async queryAgentWinrate() {
        const res = await this.dbInstance.cypher(`
            MATCH (a:Agent {id:"c2f75e6e-b25c-41dd-9f7d-31375e0a129c"}) -[p:PLAYED_IN]-> (g:Game)
            WITH a, count(g) AS GamesPlayed, collect(p.score) AS scores
            WITH a, GamesPlayed, size([i in scores WHERE i=1| i]) AS Wins
            RETURN a.id AS AgentId, GamesPlayed, Wins, 100 * Wins/GamesPlayed AS WinPercent
            ORDER BY WinPercent DESC;
        `);

        // @TODO: this return is wrong
        return res.records.map((record) => ({
            agentId: record.get('AgentId').toString(),
            initialWinPercent: record.get('InitialWinPercent').toInt(),
            lastWinPercent: record.get('LastWinPercent').toInt(),
            percentageImproved: record.get('PercentageImprovement').toInt(),
        }));
    }

    /**
     * @param {String} agentId
     * @param {Number} lookbehind number of games to seek
     * @return {any[]} all x recent games of agents
     */
    static async queryAgentRecentGames() {
        const res = await this.dbInstance.cypher(`
            MATCH (a:Agent {id:"c2f75e6e-b25c-41dd-9f7d-31375e0a129c"})
            WITH a, apoc.coll.sortNodes([(a)-[:PLAYED_IN]->(g:Game) | g ], 'timePlayed') as Games
            RETURN a as Agent, Games[0..5] as MostRecentGames;
        `);

        return res.records.map((record) => record.get('MostRecentGames'));
    }

    /**
     * @param {String} studentNumber
     * @return {any[]} all agents of user
     */
    static async queryUserAgents() {
        const res = await this.dbInstance.cypher(`
            MATCH (u:User)-[c:CONTROLS]->(a:Agent)
            WHERE u.studentNumber = "20070000"
            RETURN u as User, a as Agents;
        `);

        return res.records.map((record) => record.get('Agents'));
    }

    /**
     * @return {any[]} array of all bot agents
     */
    static async queryBotAgents() {
        const res = await this.dbInstance.cypher(`
            MATCH (u:User)-[:CONTROLS]->(a:Agent)
            WHERE u.authToken = "00000000"
            RETURN u as User, a as Agents;
        `);

        return res.records.map((record) => record.get('Agents'));
    }
}

const getMockDatabase = () => {
    console.log(chalk.red(
        `Running Server With Database Disabled,\n` +
        `If Not Intentional Please Add \`DATABASE_ENABLED=1\` to the \`.env\`\n`
    ));

    const isUserEligibleToPlay = Neo4jDatabase.isUserEligibleToPlay.name;
    const getQueryResult = Neo4jDatabase.getQueryResult.name;

    return new Proxy(Neo4jDatabase, {
        get(target, property) {
            if (property === getQueryResult) {
                return async () => ({ error: 'Database not implemented' });
            }

            if (property === isUserEligibleToPlay) {
                return async () => true;
            }

            return async () => {};
        }
    });
}

const Database = Config.database.enabled ?
    Neo4jDatabase :
    getMockDatabase();

export default Database