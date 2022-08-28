import GameInstance from './game-instance.js';

export default class GameManager {

    /** @type {Map<Number, GameInstance>} */
    games = new Map();
    /** @type {Map<String, Number>} */
    playerMap = new Map();

    async createGame(userTokens, numBots) {
        let id = 0;
        // Find the first unused id.
        while (this.lobbies.has(id)) id++;

        const game = new GameInstance(userTokens, numBots);

        this.games.set(id, game);
    }

    async removeGame() {

    }
}