import Database from "../database.js";
import IAgent from "./i-agent.js";
import gzip from "zlib";
import fs from 'fs'
import { Readable } from "stream";

class IGame {

    /** @type {typeof(IAgent)} Agent class to be instantiated. */
    static Agent;
    /** @type {typeof(IAgent)} Bot class to be instantiated. */
    static Bot;
    /** @type {typeof(IAgent)} SmartBot class to be instantiated */
    static SmartBot;

    /** @type {IAgent[]} List of all agents playing. */
    agents;
    /** @type {Function} Action resolver. */
    resolve = null;
    /** @type {Boolean} If the current game is finished. */
    finished = false;
    /** @type {{event: String, args: []}[]} Agent event record */
    events = [];
    /** @type {Object.<String, Number>} */
    indexMap = {};

    constructor(agents) {
        this.agents = agents;
        agents.forEach((agent, i) => {
            agent.index = i
            this.indexMap[agent.token] = i
        })
    }

    /**
     * @returns If the game is finished.
     */
    gameFinished() {
        return this.finished
    }

    /**
     * Runs the game. Override this method.
     */
    async playGame() {

    }

    /**
     * 
     */
    action(token, action) {
        this.agents[this.indexMap[token]].resolve(action)
        return true
    }

    /**
     * Setup and End of a game.
     */
    async main() {
        try {
            this.result = await this.playGame(this.agents)
        } catch (error) {
            console.log(`Game crashed with error:\n${error}`)
        }
        this.stream.write("The final scores are: \n")
        for (const i in this.agents) {
            this.stream.write(`\t Agent ${i}, '${this.agents[i]}':\t ${this.result[i]}\n`);
        }
        const scores = {};
        this.agents.forEach(({ token }, i) => {
            scores[token] = this.result[i]
        })

        const logs = JSON.stringify(this.events)
        // Important! Brings 500KB -> ~6KB.
        const compressed = gzip(logs)

        this.finished = true
        await Database.recordGame(scores, compressed)
    }
}

export default IGame;