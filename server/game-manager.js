import GameInstance from './game-instance.js';

export default class GameManager {
    constructor(recordGame) {
        /** @type {GameInstance[]} */
        this.games = [];
        this.recordGame = recordGame;
    }

    async createGame(userTokens, numPlayers) {
        const numCurrent = userTokens.length;
        const numBots = numPlayers - numCurrent;
        const game = new GameInstance(userTokens, numBots);

        this.games.push(game)
    }

    async closeFinishedGames() {
        const finishedIndices = this.games
            .map((i, game) => {
                return game.finished() ? i : -1;
            }).filter((i, _) => i !== -1)
            .reverse();

        for (let index of finishedIndices) {
            const game = this.games.pop(index);
            await this.recordGame(game);
        }
    }
}
