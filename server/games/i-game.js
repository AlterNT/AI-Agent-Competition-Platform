import Database from "../database.js";
import IAgent from "./i-agent.js";

class IGame {
    
    /** @type {typeof(IAgent)} Agent class to be instantiated. */
    static Agent;
    /** @type {typeof(IAgent)} Bot class to be instantiated. */
    static Bot;
    /** @type {typeof(IAgent)} SmartBot class to be instantiated */
    static SmartBot;

    /** @type {IAgent[]} List of all agents playing. */
    agents;

    /** @type {Boolean} If the current game is finished. */
    finished = false;
    // Variables for receiving agent actions.
    promise = null;
    /** @type {Function} Action resolver. */

    resolve = null;
    /** @type {{event: String, args: []}[]} Agent event record */
    events = [];

    constructor(agents) {
        this.agents = agents;
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
     * Setup and End of a game.
     */
    async main() {
        this.result = await this.playGame(this.agents)
        this.stream.write("The final scores are: \n")
        for (const i in this.agents) {
            this.stream.write(`\t Agent ${i}, '${this.agents[i]}':\t ${this.result[i]}\n`);
        }
        const scores = {};
        this.agents.forEach(({ token }, i) => {
            scores[token] = this.result[i]
        })
        this.finished = true
        console.log(JSON.stringify(this.events).length)
        await Database.recordGame(scores)
    }

    /**
     * Creates a new promise to await agent action.
     * Timeouts if action is not received within time limit.
     * @returns Action received from agent or null if timeout is exceeded.
     */
     async awaitEvent() {
        this.pending = new Promise((resolve) => {
            this.resolve = resolve;
        });

        const timeout = setTimeout(() => {
            this.resolve(null)
        }, 10000)

        const move = await this.pending;
        clearTimeout(timeout);

        return move;
    }
}

export default IGame;