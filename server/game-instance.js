import Game from './game/game.js';
import Server from './server.js';

export default class GameInstance {

    /** @type {Game} */
    game = new Server.instance.Game();
    /** @type {Boolean} */
    debug;
    /** @type {Agent[]} */
    agents = [];
    /** @type {Map<String, [{}]>} */
    playerEvents = new Map();
    // All events that have occurred.
    events = [{}];

    constructor(userTokens, numBots, debug) {
        this.debug = debug;
        this.userTokens = userTokens;

        for (let i = 0; i < userTokens.length; i++) {
            const user = userTokens[i];
            this.playerMap.set(user, i);
            this.playerEvents.set(user, []);
            this.agents.push(new Server.instance.Game.Agent(user));
        }

        for (let i = 0; i < numBots; i++) {
            this.agents.push(new Server.instance.Game.Bot(userTokens.length - 1 + i));
        }

        // TODO: look into scrambling the order, while keeping playerMap association correct.

    }

    /**
     * Starts the game.
     */
    async start() {
        await this.game.startGame(this.agents);
    }

    /**
     * Sends an event to a client.
     * This adds it to the playerEvents of the respective player.
     * @param {String|Number} token The token of the player, or ID of the bot.
     * @param {String} event Method name.
     * @param {{}} data Object containing the data for the method.
     */
    async sendEvent(token, event, data) {
        if (typeof token === Number) { // Bot.
            // Javascript is cool *o*
            // Calls the method of the bot with the name 'event' with 'data'.
            this.agents[token][event](data);
        } else { // Agent.
            const eventObj = {event: event, data: data};
            this.events.push(eventObj);
            this.playerEvents.get(token).push(eventObj);
        }
    }

    /**
     * Returns the events since the last time this method was called.
     * @param {String} token
     * @returns {[{}]}
     */
    getEvents(token) {
        events = this.playerEvents.get(token);
        this.playerEvents.set(token, []);
        return this.events;
    }

    /** */
    recieveEvent(id) {
        /**
         * TODO: Recieve data from the client.
         * Not sure if there is a better way to do this.
         * Maybe we could indicate that sendEvent() waits for a return value?
         * Then do a promise thing in there?
         */
    }

    end() {
        Server.instance.gameManager.removeGame(this);
    }

}