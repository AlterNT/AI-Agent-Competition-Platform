import GameInstance from './game-instance.js';

class GameManager {
    constructor(recordGame) {
        /** @type {GameInstance[]} */
        this.games = [];

        /** @type {Number} max concurrent games */
        this.maxGames = 10;

        this.recordGame = recordGame;
    }

    async createGame(userTokens, numPlayers) {
        const numCurrent = userTokens.length;
        const numBots = numPlayers - numCurrent;
        const game = new GameInstance(userTokens, numBots);
        this.games.push(games)
    }

    async closeFinishedGames() {
        this.games
            .map((i, game) => {
                return game.finished() ? i : -1;
            }).filter((i, _) => i !== -1)
            .reverse()
            .forEach((index) => {
                const game = this.games.pop(index);
                this.recordGame(game);
            });
    }
}

export default GameManager;
