import GameInstance from './game-instance.js';

export default class GameManager {

    /** @type {Map<String, GameInstance>} */
    gameMap = new Map();

    async createGame(userTokens, numBots, debug) {
        const game = new GameInstance(userTokens, numBots, debug);
        await game.start();
        userTokens.forEach((token) => this.games.set(token, game));
    }

    /**
     * @param {String} token
     * @returns {GameInstance}
     */
    async getGameInstance(token) {
        if (!this.gameMap.has(token)) {
            console.error(`User ${token} requested for a game, but is not in one!`);
            return null;
        }
        return this.games.get(this.gameMap.get(token));
    }

    /**
     * @param {GameInstance} game
     */
    async removeGame(game) {
        game.userTokens.forEach((token) => this.gameMap.delete(token));
    }
}