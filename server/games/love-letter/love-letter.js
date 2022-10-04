import State from "./state.js"
import RandomAgent from './random-agent.js'
import Action from './action.js'
import Database from "../../database.js";

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
    stream;
    randomAgent;

    turn = null;
    topCard = null;
    indexMap = {};

    /**
     * Constructs a LoveLetter game.
     * @param {IAgent[]} agents The agents playing this game.
     * @param {Number} seed A seed for the random number generator.
     * @param {NodeJS.WriteStream} stream A IOstream to record the events of the game.
     **/
    constructor(agents, seed = 0, stream = process.stdout) {
        super(agents);

        this.random = seedrandom(seed);
        this.stream = process.stdout.pipe(stream);
        this.randomAgent = new RandomAgent();

        this.turn = null
        this.topCard = null
        this.indexMap = {}
        this.result = null
        agents.forEach((agent, i) => {
            agent.index = i
            this.indexMap[agent.token] = i
        })
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

                    this.turn = this.agents[gameState.getNextPlayer()].token;

                    const action = await this.awaitEvent()
                    let act = Action[action.action](...action.params);
                    try {
                        this.stream.write(gameState.update(act, topCard) + '\n');
                    } catch {
                        this.stream.write(
                            `Illegal action performed by player ${this.agents[gameState.getNextPlayer()]} (${gameState.player[0]}).\n` +
                            `Random Move Substituted.`
                        );
                        this.randomAgent.newRound(gameState.playerState(gameState.getNextPlayer()));
                        act = this.randomAgent.playCard(topCard);
                        console.log('Random action.', act);
                        this.stream.write(gameState.update(action, topCard) + '\n');
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
            this.stream.write(`Player ${gameState.gameWinner()} wins the Princess's heart!\n`);
            const scoreboard = new Array(numPlayers);
            for (let i = 0; i < numPlayers; i++) { scoreboard[i] = gameState.score(i); }
            return scoreboard;
        } catch (e) {
            this.stream.write('Something went wrong.\n', e);
            process.error(e);
            return null;
        }
    }
}

export default LoveLetter