import State from "./state.js"
import RandomAgent from './random-agent.js'
import Action from './action.js'
import Database from "../../database.js";

import seedrandom from 'seedrandom'

/**
 * A class for running a single game of LoveLetter.
 * An array of 4 agents is provided, a deal is initialised and players takes turns until the game ends and the score is reported.
 * @author Tim French
 **/
class LoveLetter {
    /**
     * Constructs a LoveLetter game.
     * @param seed a seed for the random number generator.
     * @param stream a iostream to record the events of the game
     **/
    constructor(agents, seed=0, stream=process.stdout) {
        this.agentTokens = agents
        this.agents = [
            new RandomAgent(agents[0], seedrandom(0)), 
            new RandomAgent(agents[1], seedrandom(1)), 
            new RandomAgent(agents[2], seedrandom(2)), 
            new RandomAgent(agents[3], seedrandom(3))
        ]
        this.random = seedrandom(seed)
        this.stream = process.stdout.pipe(stream)
        this.randomAgent = new RandomAgent()
        this.result = null

        this.finished = false
        this.turn = null
        this.promise = null
        this.resolve = null

        this.topCard = null
        this.agentIndex = {}
        agents.forEach((agent, i) => {
            this.agentIndex[agent] = i
        })
    }

    gameFinished() {
        return this.finished
    }

    isTurn(agentToken) {
        return agentToken == this.turn
    }

    getState(agentToken) {
        const index = this.agentIndex[agentToken]
        const state = { ...this.agents[index].state }
        delete state.agents

        return state
    }

    getTopCard() {
        return this.topCard
    }

    /**
     * Creates a new promise to await agent action
     * Timeouts if action is not received within time limit
     * @returns action received from agent or null if timeout is reached
     **/
    async awaitEvent() {
        this.pending = new Promise((resolve) => {
            this.resolve = resolve
        })

        const timeout = setTimeout(() => {
            this.resolve(null)
        }, 10000)

        const move = await this.pending
        clearTimeout(timeout)

        return move
    }

    /**
     * Plays a game of LoveLetter
     * @param agents the players in the game
     * @return scores of each agent as an array of integers
     **/
    async playGame(agents) {
        const numPlayers = agents.length
        const gameState = new State(this.random, agents)
        const playerStates = []
        try {
            while (!gameState.gameOver()) {
                for (let i = 0; i < numPlayers; i++) {
                    playerStates[i] = gameState.playerState(i)
                    agents[i].newRound(playerStates[i])
                }
                while (!gameState.roundOver()) {
                    console.log("Cards are:\nplayer 0:" + JSON.stringify(gameState.getCard(0)) + "\nplayer 1:" + JSON.stringify(gameState.getCard(1)) + "\nplayer 2:" + JSON.stringify(gameState.getCard(2)) + "\nplayer 3:" + JSON.stringify(gameState.getCard(3)) + "\n")
                    const topCard = gameState.drawCard()
                    this.topCard = topCard
                    console.log("Player " + gameState.getNextPlayer() + " draws the " + topCard.name + " card.")
                    this.turn = this.agents[gameState.getNextPlayer()].name
                    let action = await this.awaitEvent()
                    let act = Action[action.action](...action.params)
                    try {
                        this.stream.write(gameState.update(act, topCard) + '\n')
                    } catch {
                        this.stream.write("ILLEGAL ACTION PERFORMED BY PLAYER " + agents[gameState.getNextPlayer()] + 
                        "(" + gameState.player[0] + ")\nRandom Move Substituted" + '\n')
                        this.randomAgent.newRound(gameState.playerState(gameState.getNextPlayer()))
                        act = this.randomAgent.playCard(topCard)
                        console.log('random action', act)
                        this.stream.write(gameState.update(action, topCard) + '\n')
                    }
                    for (let i = 0; i < numPlayers; i++) { agents[i].see(act, playerStates[i]) }
                }
                console.log("New Round, scores are:\n\nPlayer 0: " + gameState.score(0) + "\nPlayer 1: " + gameState.score(1) + "\nPlayer 2: " + gameState.score(2) + "\nPlayer 3: " + gameState.score(3) + "\n")
                gameState.newRound()
            }
            this.stream.write("Player " + gameState.gameWinner() + " wins the Princess's heart!" + '\n')
            const scoreboard = new Array(numPlayers)
            for (let i = 0; i < numPlayers; i++) { scoreboard[i] = gameState.score(i) }
            return scoreboard
        } catch (e) {
            this.stream.write("something went wrong" + '\n', e)
            process.error(e)
            return null
        }
    }

    async main() {
        this.result = await this.playGame(this.agents)
        this.stream.write("The final scores are: \n")
        for (const i in this.agents) {
            this.stream.write("\t Agent "+i+", \"" + this.agents[i]+"\":\t " + this.result[i]+"\n")
        }

        const scores = {};
        this.agents.forEach(({ name }, i) => {
            scores[name] = this.result[i]
        })
        this.finished = true
        await Database.recordGame(scores)
    }
}

export default LoveLetter