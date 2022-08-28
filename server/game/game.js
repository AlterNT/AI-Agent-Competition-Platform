import Agent from "./agent.js";

export default class Game {

    /** @abstract @type {Number} */
    static minPlayers;
    /** @abstract @type {Number} */
    static maxPlayers;
    /** @abstract @type {typeof Agent} */
    static Agent;
    /** @abstract @type {typeof Agent} */
    static Bot;

    /**
     * @abstract
     * @param {Agent[]} agents
     */
    async startGame(agents) {

    }
}