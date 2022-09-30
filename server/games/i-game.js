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

    /**
     * @returns If the game is finished.
     */
    gameFinished() {
        return this.finished
    }
    
    constructor(agents) {
        this.agents = agents;
    }

    async main() {}

}

export default IGame;