import GameInstance from './game-instance.js';

export default class GameManager {

    /** @type {GameInstance[]} */
    games = [];

    async createGame(userTokens, numBots) {
        const game = new GameInstance(userTokens, numBots);
        this.games.push(game);
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