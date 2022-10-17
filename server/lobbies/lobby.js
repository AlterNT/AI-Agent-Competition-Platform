import fs from "fs";
import config from "../config.js";
import Database from "../database.js";
import LobbyManager from "../lobby-manager.js";

class Lobby {
  /** @type {[String]} Array of agent tokens. */
  tokens = [];
  /** @type {String} ID of game. */
  gameID;
  /** @type {{maxPlayers: Number, minPlayers: Number, autoLogging: Boolean, loggingEnabled: Boolean, bot: 'bot'|'smart-bot'}} Settings of current game. */
  gameSettings;
  /** @type {Number} How many players for this lobby to start. */
  slots;
  /** @type {Number} */
  bots = 0;
  /** @type {String} */
  password = "";

  constructor(gameID, options) {
    this.gameSettings = config.games[gameID].settings;
    // Max number of bots in a lobby is 1 less than the number to start.
    this.bots = Math.min(
      options?.bots ?? this.bots,
      this.gameSettings.maxPlayers - 1
    );
    // Clamp slots to valid number.
    this.slots = Math.min(
      Math.max(
        options?.slots ?? this.gameSettings.maxPlayers,
        this.gameSettings.minPlayers
      ),
      this.gameSettings.maxPlayers
    );
    console.log(this.slots);
    this.password = options?.password ?? this.password;
    this.gameID = gameID;
  }

  /**
   * Adds agent tokens if they aren't already in the lobby.
   * @param {String} agentToken All tokens to be added.
   * @returns If the agent was added successfully.
   */
  addAgent(agentToken, password = "") {
    if (
      password === this.password &&
      !this.tokens.includes(agentToken) &&
      !this.isFull()
    ) {
      this.tokens.push(agentToken);
      return true;
    }
    return false;
  }

  removeAgent(agentToken) {
    this.tokens = this.tokens.filter((token) => token !== agentToken);
  }

  async initGame() {
    let gameClass = (await import(`../games/${config.games[this.gameID].path}`))
      .default;
    let agents = [];

    // Create Agents.
    for (const token of this.tokens) {
      agents.push(this.createAgent(gameClass.Agent, token));
    }

    // Create Bots.
    for (let i = 0; i < this.bots; i++) {
      let agentClass;
      switch (this.gameSettings.bot) {
        case "bot":
          agentClass = gameClass.Bot;
          break;
        case "smart-bot":
          agentClass = gameClass.SmartBot;
          break;
        default:
          agentClass = gameClass.Bot;
          console.error(
            `Unrecognized bot type ${this.gameSettings.bot}!\n` +
              `Defaulting to 'bot'.`
          );
      }
      const token = `${this.gameID}-${this.gameSettings.bot}-${i + 1}`;
      // Create bot user if it doesn't exist yet.
      if (!!(await Database.getUserAgent(token))) {
        await Database.createUserAndAgent(
          token,
          token,
          `bot-${this.gameID} #${i + 1}`,
          true
        );
      }

      this.tokens.push(token);
      agents.push(this.createAgent(agentClass, token));
    }

    let game = new gameClass(agents, 0);

    // Intercept 'push' on the events object if logging is disabled.
    let events = new Proxy([], {
      get: (target, prop, _) => {
        if (!this.gameSettings.loggingEnabled) {
          return () => false;
        }
        return target[prop];
      },
    });
    game.events = events;

    return game;
  }

  createAgent(classRef, token) {
    // If default interception logging is disabled.
    if (!this.gameSettings.autoLogging) return new classRef(token);
    // Use proxies to intercept function and method calls for logging.
    return new Proxy(new classRef(token), {
      get: (target, event, _) => {
        if (typeof target[event] == "function") {
          return (...args) => {
            // Agent method called.
            const eventObj = { event, args };
            LobbyManager.agentGame[token].events.push(eventObj);
            return target[event](...args);
          };
        } else {
          // Return the property accessed.
          return target[event];
        }
      },
    });
  }

  isFull() {
    return this.bots + this.tokens.length === this.slots;
  }
}

export default Lobby;
