import State from "./state.js"
import RandomAgent from './random-agent.js'

import seedrandom from 'seedrandom';
import IGame from '../i-game.js';
import Agent from './agent.js';

/**
 * A class for running a single game of LoveLetter.
 * An array of 4 agents is provided, a deal is initialized and players takes turns until the game ends and the score is reported.
 * @author Tim French
 **/
class LoveLetter extends IGame {

    static Agent = Agent;
    static Bot = RandomAgent;

    random;
    randomAgent = new LoveLetter.Bot();

    turn = null;
    topCard = null;
    result = null;

    /**
     * Constructs a LoveLetter game.
     * @param {IAgent[]} agents The agents playing this game.
     * @param {Number} seed A seed for the random number generator.
     **/
    constructor(agents, seed = 0) {
        super(agents);

        this.random = seedrandom(seed);
    }

    getPlayerIndexInitial(agentToken) {
        return this.indexMap[agentToken];
    }

    getState(agentToken) {
        const index = this.indexMap[agentToken]
        const state = { ...this.agents[index].state }
        delete state.agents

        return state
    }

    getTopCard() {
        return this.topCard;
    }

    /**
     * Plays a game of LoveLetter.
     * @return Scores of each agent as an array of integers.
     **/
    async playGame() {
        const numPlayers = this.agents.length;
        const gameState = new State(this.random, this.agents);
        const playerStates = [];
        try {
            while (!gameState.gameOver()) {
                for (let i = 0; i < numPlayers; i++) {
                    playerStates[i] = gameState.playerState(i);
                    this.agents[i].newRound(playerStates[i]);
                }
                while (!gameState.roundOver()) {
                    console.log(
                        `Cards are:\n` +
                        `player 0: ${JSON.stringify(gameState.getCard(0))}\n` +
                        `player 1: ${JSON.stringify(gameState.getCard(1))}\n` +
                        `player 2: ${JSON.stringify(gameState.getCard(2))}\n` +
                        `player 3: ${JSON.stringify(gameState.getCard(3))}`
                    )
                    const topCard = gameState.drawCard();
                    this.topCard = topCard;
                    console.log(`Player ${gameState.getNextPlayer()} draws the ${topCard.name} card.`);

                    let agent = this.agents[gameState.getNextPlayer()]
                    this.turn = agent.token;

                    let act = await agent.playCard(topCard)
                    try {
                        gameState.update(act, topCard);
                    } catch {
                        this.randomAgent.newRound(gameState.playerState(gameState.getNextPlayer()));
                        act = this.randomAgent.playCard(topCard);
                        console.log('Random action.', act);
                        gameState.update(act, topCard);
                    }
                    for (let i = 0; i < numPlayers; i++) { this.agents[i].see(act, playerStates[i]); }
                }
                console.log(
                    `New round, scores are:\n\n` +
                    `Player 0: ${gameState.score(0)}\n` +
                    `Player 1: ${gameState.score(1)}\n` +
                    `Player 2: ${gameState.score(2)}\n` +
                    `Player 3: ${gameState.score(3)}`
                );
                gameState.newRound();
            }
            const scoreboard = new Array(numPlayers);
            for (let i = 0; i < numPlayers; i++) { scoreboard[i] = gameState.score(i); }
            return scoreboard;
        } catch (e) {
            process.error(e);
            return null;
        }
    }
}

export default LoveLetter