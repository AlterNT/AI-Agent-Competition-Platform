//import chalk from 'chalk';
import fs from "fs";
import Neode from "neode";

import Models from "./models/index.js";
import TokenGenerator from "./token-generator.js";
import DBSync from "./db-sync.js";
import config from "./config.js";
import { gunzip, gunzipSync } from "zlib";

class Neo4jDatabase {
  /** @type {[String]} */
  static defaultAgentToken = "00000000";
  static dbInstance;
  static dbSync;

  static async init() {
    const dbHost =
      process.env.NODE_ENV === "test" && config.database.host === "neo4j"
        ? `${config.database.host}-test`
        : config.database.host;

    /** @type {Neode} */
    this.dbInstance = new Neode(
      `${config.database.protocol}://${dbHost}:${config.database.port}`,
      config.database.username,
      config.database.password
    ).with(Models);

    if (!this.dbInstance) {
      throw new Error("Could not connect to neo4j");
    }

    const batchQueries = [
      this.queryGames,
      this.queryAgents,
      this.queryTopWinrate,
      this.queryMostImproved,
      this.queryMostImproving,
      this.queryAdminView,
    ];

    const timeoutDurationMilliseconds = 4_000;

    /** @type {DBSync} */
    this.dbSync = new DBSync();
    await this.dbSync.start(batchQueries, timeoutDurationMilliseconds);

    await this.createAdminUser();
  }

  // Creates an admin user if one doesn't yet exist
  static async createAdminUser() {
    const adminToken = config.database.defaultAdminToken;
    const defaultAdmin = await this.dbInstance.find("Admin", adminToken);
    if (!defaultAdmin) {
      return await this.dbInstance.create("Admin", {
        adminToken,
      });
    } else {
      return defaultAdmin;
    }
  }

  static async getAllDisplayNames() {
    const users = await this.dbInstance.all("User");
    return users.map((_, i) => users.get(i).properties().displayName);
  }

  static async closeConnectionWithDelay(ms) {
    return new Promise((resolve) =>
      setTimeout(() => {
        this.dbInstance.close();
        resolve();
      }, ms)
    );
  }

  static async close(deleteDatabase = false) {
    this.dbSync.close();

    if (deleteDatabase) {
      this.deleteAll();
    }

    // wait for all dbSync timeouts to end???
    await this.closeConnectionWithDelay(10_000);
  }

  // Has a 0.4% chance for a collision given 200 students
  static async generateRandomName() {
    const words = JSON.parse(fs.readFileSync("./wordlists.json"));
    const existingNames = await this.getAllDisplayNames();

    while (true) {
      const randRange = (low, high) =>
        Math.floor((high - low) * Math.random() + low);
      const randElement = (arr) => arr[randRange(0, arr.length)];

      const adjective = randElement(words.adjectives);
      const colour = randElement(words.colours);
      const fruit = randElement(words.fruit);
      const number = `${randRange(0, 9)}${randRange(0, 9)}`;

      const displayName = `${adjective}${colour}${fruit}${number}`;
      if (!existingNames.includes(displayName)) {
        return displayName;
      }
    }
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
    const numAgents = 6;
    const gamesPerAgent = 70;
    const agentsPerGame = 4;
    const numGames = Math.ceil((numAgents * gamesPerAgent) / agentsPerGame);

    console.log("Cleaning Database...");
    await this.deleteAll();

    console.log("Initializing default agent...");
    await this.getDefaultAgent();

    console.log("Generating User Data...");
    const studentNumbers = [...new Array(numAgents)].map((_, i) =>
      String(10000 * i + 20000000)
    );
    studentNumbers.push(this.defaultAgentToken);

    const tokengen = new TokenGenerator();
    const userData = tokengen.computeStudentTokens(studentNumbers);

    console.log("Creating Users and Agents...");
    await Promise.all(
      userData.map(({ studentNumber, authToken }) =>
        this.createUserAndAgent(studentNumber, authToken)
      )
    );

    console.log("Creating Games");
    const gameRecordings = [];
    for (let i = 0; i < numGames; i++) {
      // pick 5 without replacement
      const usersInGame = [...studentNumbers]
        .sort(() => 0.5 - Math.random()) // shuffle
        .slice(0, agentsPerGame);

      const userScores = {};
      usersInGame.forEach((token, i) => {
        userScores[token] = i == 0 ? 1.0 : 0.0;
      });

      const promise = this.recordGame(userScores, "{}");
      gameRecordings.push(promise);
    }

    await Promise.all(gameRecordings);

    return;
  }

  /**
   * Drops every instance of every label from the db
   */
  static async deleteAll() {
    for (const label in Models) {
      await this.dbInstance.deleteAll(label);
    }
  }

  /**
   * @returns {Neode.Node<Models.User>}
   */
  static async getDefaultUser() {
    const defaultAgent = await this.dbInstance.find(
      "User",
      Database.defaultAgentToken
    );
    if (defaultAgent) {
      return defaultAgent;
    }

    const user = await this.createUser(
      Database.defaultAgentToken,
      "000000",
      "DefaultBotAgent",
      true
    );
    const agent = await this.dbInstance.create("Agent", {
      srcPath: "???",
    });

    await Promise.all([
      user.relateTo(agent, "controls"),
      agent.relateTo(user, "controls"),
    ]);

    return await this.dbInstance.find("User", Database.defaultAgentToken);
  }

  /**
   * Creates the default user if they do not exist
   * @returns {Neode.Node<Models.Agent>}
   */
  static async getDefaultAgent() {
    const user = await this.getDefaultUser();
    const agent = user.get("controls").endNode();
    return agent;
  }

  /**
   * @returns {Neode.Node<Models.Game>}
   */
  static async createGameNode() {
    return await this.dbInstance.create("Game", {});
  }

  static async createAdmin(adminToken) {
    return await this.dbInstance.create("Admin", {
      adminToken,
    });
  }

  // neode `.find` method not working as intended?
  // did authentication manually
  static async authenticateAdmin(adminToken) {
    if (process.env.NODE_ENV === "test") {
      return adminToken === "admin";
    }

    const admins = await this.dbInstance.all("Admin");
    const authenticated = !!admins
      .map((_, i) => admins.get(i).properties().adminToken)
      .filter((token) => token === adminToken).length;

    return authenticated;
  }

  /**
   * Use createUserAndAgent instead!
   * @param {String} userToken
   * @param {String | Number} studentNumber
   * @param {String | null} selectedDisplayName
   * @param {Boolean} isBot
   * @returns {Neode.Node<Models.User>}
   */
  static async createUser(
    studentNumber,
    authToken,
    selectedDisplayName,
    isBot
  ) {
    const displayName =
      selectedDisplayName || (await this.generateRandomName());
    return await this.dbInstance.create("User", {
      studentNumber: String(studentNumber),
      authToken,
      displayName,
      isBot,
    });
  }

  /**
   * Use createUserAndAgent instead!
   * @param {Neode.Node<Models.User>} user
   * @param {String} srcPath
   * @returns {Neode.Node<Models.Agent>}
   */
  static async createAgent(user, srcPath) {
    let agent = await this.dbInstance.create("Agent", {
      srcPath: srcPath,
    });

    await Promise.all([
      user.relateTo(agent, "controls"),
      agent.relateTo(user, "controls"),
    ]);

    return await this.dbInstance.find("Agent", agent.id());
  }

  /**
   * @param {String | Number} studentNumber
   * @param {String} authToken
   * @returns {Neode.Node<Models.Agent>}
   */

  static async createUserAndAgent(
    studentNumber,
    authToken,
    selectedDisplayName = null,
    isBot = false
  ) {
    const user = await this.createUser(
      studentNumber,
      authToken,
      selectedDisplayName,
      isBot
    );
    const agent = await this.createAgent(user, "/code");

    return agent;
  }

  /**
   * @param {String} userToken (can actually be either authToken or Student Number);
   * @return {Neode.Node<Models.Agent> | null} Agent model
   */
  static async getUserAgent(userToken) {
    const user =
      (await this.dbInstance.first("User", "authToken", userToken)) ||
      (await this.dbInstance.find("User", userToken));

    const edge = user.get("controls");
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
    const games = agent.get("playedIn").endNode();

    return games;
  }

  /**
   * Only a user with a valid agent can play
   * Returns whether they have a valid agent
   * @param {String} userToken
   * @return {Boolean}
   */
  static async isUserEligibleToPlay(userToken) {
    const user = await this.dbInstance.first("User", "authToken", userToken);

    return !!user && !!(await this.getUserAgent(userToken));
  }

  /**
   * Creates agent <-> game edges in the db
   * @TODO add isTournament?
   * @param {{ userToken: String, score: Number}} gameOutcome
   * @param {Boolean} tournamentMode
   */
  static async recordGame(gameOutcome, gameState, tournamentMode = false) {
    const game = await this.createGameNode();
    await game.update({ gameState: gameState, isTournament: tournamentMode });

    const relationMappings = [];
    for (const [userToken, score] of Object.entries(gameOutcome)) {
      // Might need score to be set
      const agent = await this.getUserAgent(userToken);
      const agentRelation = agent.relateTo(game, "playedIn", { score });
      const gameRelation = game.relateTo(agent, "playedIn", { score });

      relationMappings.push(agentRelation);
      relationMappings.push(gameRelation);
    }

    await Promise.all(relationMappings);
  }

  /**
   * Generates and assigns a token for each student number in the file
   * One student number should be present on each line
   * @param {String} studentNumbersFilePath string containing the file path of the student numbers file
   * @param {Boolean | undefined} isAdmin
   * @returns {{studentNumber: String, authToken: String}[]} an array of objects with the last token generated at the last index
   */
  static async generateUserTokens(seedTokens, isAdmin) {
    const tokengen = new TokenGenerator();
    const studentData = tokengen.computeStudentTokens(seedTokens);
    const userData = [];

    for (const { studentNumber, authToken } of studentData) {
      if (isAdmin && !(await this.authenticateAdmin(authToken))) {
        await this.createAdmin(authToken);
        userData.push(authToken);
      } else {
        const user = await this.dbInstance.find("User", studentNumber);

        if (!user) {
          await this.createUserAndAgent(studentNumber, authToken);
          userData.push({ studentNumber, authToken });
        }
      }
    }

    return userData;
  }

  static async generateTokensFromFile(seedTokensFilePath, isAdmin) {
    let seedTokensFileContent;
    try {
      seedTokensFileContent = fs.readFileSync(seedTokensFilePath).toString();
    } catch (exception) {
      console.error(
        `Cannot read specified file, please check permission and location\n${exception}`
      );
      return [];
    }

    const seedTokens = seedTokensFileContent.trim().split("\n");

    return await this.generateUserTokens(seedTokens, isAdmin);
  }

  /**
   * @return {any[]} array of all games
   */
  static async queryGames() {
    const res = await this.dbInstance.all("Game");
    return res.map((_, i) => {
      const game = res.get(i);
      const agentEdges = game.get("playedIn");
      const agentScores = {};
      agentEdges.map((_, i) => {
        const agentEdge = agentEdges.get(i);
        const agentId = agentEdge.startNode().get("id");
        const score = agentEdge.properties().score.toFixed(2);

        agentScores[agentId] = score;
      });

      // Remove game-log object.
      let props = game.properties();
      delete props.gameState;

      return {
        ...game.properties(),
        agentScores,
      };
    });
  }

  /**
   * @param {Integer} page
   * @return {any[]} array of all games
   */
  static async paginateGames(page) {
    const gamesPerPage = 100;
    const res = await this.dbInstance.cypher(
      `
            MATCH (g:Game)<-[rel]-(a:Agent)
            WITH g, collect({score: rel.score, agent: a.id}) as scores
            RETURN g, scores
            ORDER BY g.timePlayed ASC
            SKIP (toInteger($page) - 1) * toInteger($gamesPerPage)
            LIMIT toInteger($gamesPerPage);
        `,
      {
        gamesPerPage,
        page,
      }
    );

    return res.records.map((res) => {
      const game = res.get("g");
      const scores = res.get("scores");
      const agentScores = {};
      scores.forEach(({ score, agent }) => {
        agentScores[agent] = score;
      });
      const gameProperties = { ...game.properties };
      gameProperties.timePlayed = gameProperties.timePlayed.toString();
      // Remove game-log object.
      delete gameProperties.gameState;

      return {
        ...gameProperties,
        agentScores,
      };
    });
  }

  /**
   * @param {Integer} page
   * @return {any[]} array of all games
   */
  static async paginateGameHistories(page) {
    const gamesPerPage = 100;
    const res = await this.dbInstance.cypher(
      `
            MATCH (g:Game)<-[rel]-(a:Agent)
            WITH g, collect({score: rel.score, agent: a.id}) as scores
            RETURN g, scores
            ORDER BY g.timePlayed ASC
            SKIP (toInteger($page) - 1) * toInteger($gamesPerPage)
            LIMIT toInteger($gamesPerPage);
        `,
      {
        gamesPerPage,
        page,
      }
    );

    return res.records.map((res) => {
      const game = res.get("g");
      const scores = res.get("scores");
      const agentScores = {};
      scores.forEach(({ score, agent }) => {
        agentScores[agent] = score;
      });
      const gameProperties = { ...game.properties };
      gameProperties.timePlayed = gameProperties.timePlayed.toString();
      // Decompress game-log object.
      let props = game.properties();
      props.gameState = JSON.parse(
        gunzipSync(Buffer.from(props.gameState)).toString
      );

      return {
        ...gameProperties,
        agentScores,
      };
    });
  }

  // TODO this returns number of games, not number of pages
  static async countPages() {
    const res = await this.dbInstance.cypher(`
            MATCH (g:Game)
            RETURN count(g) as pages;
        `);

    const gamesPerPage = 100;
    const numGames = res.records[0].get("pages").toInt();
    const numPages = Math.ceil(numGames / gamesPerPage);

    return numPages;
  }

  /**
   * @TODO remove token from users
   * @return {any[]} array of all user and agents id
   */
  static async queryAgents() {
    const res = await this.dbInstance.all("User");
    const allUsers = res.map((_, i) => {
      const user = res.get(i);
      const agentId = user.get("controls")?.endNode()?.get("id");
      const { isBot, displayName } = user.properties();

      return {
        agentId,
        isBot,
        displayName,
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
  static async queryTopWinrate(isTournamentInput = false) {
    const isTournament = !!isTournamentInput;
    const res = await this.dbInstance.cypher(
      `
            MATCH (u:User)-[:CONTROLS]->(a:Agent)-[p:PLAYED_IN]-> (g:Game)
            WHERE g.isTournament = $isTournament
            WITH a, u, count(g) AS GamesPlayed, collect(p.score) AS scores
            WITH a, u, GamesPlayed, size([i in scores WHERE i=1| i]) AS Wins
            RETURN a.id as AgentId, u.isBot as IsBot, u.displayName as DisplayName, GamesPlayed, Wins, 100 * Wins/GamesPlayed AS WinPercent
            ORDER BY WinPercent DESC;
        `,
      {
        isTournament,
      }
    );

    return res.records.map((record) => ({
      displayName: record.get("DisplayName").toString(),
      isBot: record.get("IsBot").toString(),
      gamesPlayed: record.get("GamesPlayed").toInt(),
      wins: record.get("Wins").toInt(),
      winPercent: record.get("WinPercent").toNumber().toFixed(2),
    }));
  }

  /**
   * Finds the most improved agents comparing past performance to recent performance
   * @return {any[]} list of agents and improvements sorted by most improved
   */
  static async queryMostImproved() {
    const res = await this.dbInstance.cypher(`
        MATCH (u:User)-[:CONTROLS]->(a:Agent) -[p:PLAYED_IN]-> (g:Game)
        WITH a, u, collect(p.score) as Scores, apoc.coll.sortNodes(collect(g), 'timePlayed') as Games
        WITH a, u, Scores[0..5] as FFGS, Scores[-5..] as LFGS, Games[0..5] as FFG, Games[-5..] as LFG
        WITH a,
            u,
            size(FFG) as FFGSize, size(LFG) as LFGSize,
            size([i in FFGS WHERE i=1]) as FFGWins,
            size([i in LFGS WHERE i=1]) as LFGWins
        WITH a,
            u,
            100 * FFGWins/FFGSize as InitialWinPercent,
            100 * LFGWins/LFGSize as LastWinPercent
        RETURN a as Agent,
            u.displayName as DisplayName,
            InitialWinPercent,
            LastWinPercent,
            LastWinPercent - InitialWinPercent as PercentageImprovement
        ORDER BY PercentageImprovement DESC;
        `);

    return res.records.map((record) => ({
      displayName: record.get("DisplayName").toString(),
      initialWinPercent: record.get("InitialWinPercent").toInt(),
      lastWinPercent: record.get("LastWinPercent").toInt(),
      percentageImproved: record.get("PercentageImprovement").toInt(),
    }));
  }

  /**
   * Finds the most improved agents comparing past performance to recent performance
   * @return {any[]} list of agents and improvements sorted by most improved
   */
  static async queryMostImproving() {
    const res = await this.dbInstance.cypher(`
        MATCH (u:User)-[:CONTROLS]->(a:Agent) -[p:PLAYED_IN]-> (g:Game)
        WITH a, u, collect(p.score) as Scores, apoc.coll.sortNodes(collect(g), 'timePlayed') as Games
        WITH a, u, Scores[-10..-5] as FFGS, Scores[-5..] as LFGS, Games[-10..-5] as FFG, Games[-5..] as LFG
        WITH a,
            u,
            size(FFG) as FFGSize, size(LFG) as LFGSize,
            size([i in FFGS WHERE i=1]) as FFGWins,
            size([i in LFGS WHERE i=1]) as LFGWins
        WITH a,
            u,
            100 * FFGWins/FFGSize as InitialWinPercent,
            100 * LFGWins/LFGSize as LastWinPercent
        RETURN a as Agent,
            u.displayName as DisplayName,
            InitialWinPercent,
            LastWinPercent,
            LastWinPercent - InitialWinPercent as PercentageImprovement
        ORDER BY PercentageImprovement DESC;
        `);

    return res.records.map((record) => ({
      displayName: record.get("DisplayName").toString(),
      initialWinPercent: record.get("InitialWinPercent").toInt(),
      lastWinPercent: record.get("LastWinPercent").toInt(),
      percentageImproved: record.get("PercentageImprovement").toInt(),
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

    return res.records.map((record) => record.get("Games").toString());
  }

  /**
   *   Admin View for Tim
   */
  static async queryAdminView() {
    const res = await this.dbInstance.cypher(`
            MATCH (u:User)
            RETURN u.studentNumber as studentNumber, u.displayName as displayName, u.authToken as authToken;
        `);

    return res.records.map((record) => ({
      studentNumber: record.get("studentNumber").toString(),
      displayName: record.get("displayName").toString(),
      authToken: record.get("authToken").toString(),
    }));
  }

  static async setDisplayName(studentNumber, displayName) {
    const user = await this.dbInstance.find("User", studentNumber);
    if (!user) {
      return {
        success: false,
        error: `Student number ${studentNumber} does not exist in the database`,
      };
    }

    const existingNames = await this.getAllDisplayNames();
    if (existingNames.includes(displayName)) {
      return {
        success: false,
        error: `Display Name ${displayName} already taken`,
      };
    }

    user.update({ displayName });

    return {
      success: true,
      error: null,
    };
  }
}

const getMockDatabase = () => {
  console.log(
    //chalk.red(
    `Running Server with Database disabled.\n` +
      `If this is not intentional, please set database.enabled to true in 'config.json5'!\n`
  );

  const isUserEligibleToPlay = Neo4jDatabase.isUserEligibleToPlay.name;
  const getQueryResult = Neo4jDatabase.getQueryResult.name;

  return new Proxy(Neo4jDatabase, {
    get(_, property) {
      if (property === getQueryResult) {
        return async () => ({ error: "Database not implemented" });
      }

      if (property === isUserEligibleToPlay) {
        return async () => true;
      }

      return async () => {};
    },
  });
};

const Database =
  process.env.NODE_ENV === "test" || config.database.enabled
    ? Neo4jDatabase
    : getMockDatabase();

export default Database;
