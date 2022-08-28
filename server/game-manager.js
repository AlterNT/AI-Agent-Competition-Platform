import GameInstance from './game-instance.js';

export default class GameManager {

    /** @type {Map<Number, GameInstance>} */
    games = new Map();
    /** @type {Map<String, Number>} */
    playerMap = new Map();

    async createGame(userTokens, numBots, debug) {
        let gameId = 0;
        // Find the first unused id.
        while (this.lobbies.has(gameId)) gameId++;

        for (let token of userTokens) {
            this.playerMap.set(token, gameId);
        }

        const game = new GameInstance(userTokens, numBots, debug);
        await game.start();
        this.games.set(gameId, game);
    }

    async getGameInstance(token) {
        if (!this.playerMap.has(token)) {
            console.error(`User ${token} requested for a game, but is not in one!`);
            return null;
        }
        return this.games.get(this.playerMap.get(token));
    }

    async removeGame(game) {
        // Cheese way of getting the id of the game.
        const id = this.playerMap.get(game.userTokens[0]);
        for (const token of game.userTokens) {
            this.playerMap.delete(token);
        }
        this.games.delete(id);
    }
}