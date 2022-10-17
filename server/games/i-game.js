import Database from "../database.js";
import IAgent from "./i-agent.js";
import { gzip } from "zlib";
import fs from "fs";
import { Readable } from "stream";
import config from "../config.js";
import TokenGenerator from "../token-generator.js";

class IGame {
  /**
   * @type {typeof(IAgent)}
   * Agent class to be instantiated.
   * Assign this to the IAgent Agent implemented for the current game.
   */
  static Agent;
  /**
   * @type {typeof(IAgent)}
   * Bot class to be instantiated.
   * Assign this to the IAgent Bot implemented for the current game.
   */
  static Bot;
  /**
   * @type {typeof(IAgent)}
   * Bot class to be instantiated.
   * Assign this to the IAgent Smart Bot implemented for the current game.
   */
  static SmartBot;

  /** @type {IAgent[]} List of all agents playing. */
  agents;
  /** @type {Function} Action resolver. */
  resolve = null;
  /** @type {Boolean} If the current game is finished. */
  finished = false;
  /** @type {{event: String, args: []}[]} Agent event record. */
  events = [];
  /** @type {Object.<String, Number>} A map of tokens to player indices. */
  indexMap = {};
  /** @type {String} The current player's turn. */
  turn = null;
  /** @type {{}} The last action played. */
  lastPlayedAction = null;

  /**
   * Constructs a new Game instance and assigns
   */
  constructor(agents) {
    this.agents = agents;
    agents.forEach((agent, i) => {
      agent.index = i;
      this.indexMap[agent.token] = i;
    });
  }

  /**
   * Runs the game.
   * @returns {Number[]} A list of scores, with indexes corresponding to each agent.
   * See indexMap (in the constructor) for details on which indices corresponds to who.
   * Implement this.
   */
  async playGame() {}

  /**
   * Returns the state visible to a specific player.
   * Implement this.
   */
  getState(token) {
    const index = this.indexMap[token];
    const state = { ...this.agents[index].state };

    return state;
  }

  /**
   * Resolves a player's action.
   * Do not override this.
   */
  action(token, action) {
    this.agents[this.indexMap[token]].resolve(action);
    return true;
  }

  /**
   * @returns If the game is finished.
   * Do not override this.
   */
  gameFinished() {
    return this.finished;
  }

  /**
   * @returns The last played action.
   * Do not override this.
   */
  getLastPlayedAction() {
    return this.lastPlayedAction;
  }

  /**
   * Setup and End of a game.
   * Do not override this.
   */
  async main() {
    try {
      this.result = await this.playGame(this.agents);
    } catch (error) {
      console.log(`Game crashed with error:\n${error}`);
    }
    const scores = {};
    this.agents.forEach(({ token }, i) => {
      scores[token] = this.result[i];
    });

    console.log(this.events);
    const logs = JSON.stringify(this.events);

    // Important! Brings 500KB -> ~6KB.
    gzip(logs, (_, buffer) => {
      const compressed = buffer.toString("base64");
      Database.recordGame(scores, compressed, config.tournamentMode).then(
        () => {
          this.finished = true;
        }
      );
    });
  }
}

export default IGame;
