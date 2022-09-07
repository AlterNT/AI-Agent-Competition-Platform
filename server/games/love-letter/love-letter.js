import State from "./state.js"
import RandomAgent from './random-agent.js'

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
    constructor(seed=0, stream=process.stdout) {
        this.random = seedrandom(seed)
        this.stream = process.stdout.pipe(stream)
        this.randomAgent = new RandomAgent()
    }

    /**
     * Plays a game of LoveLetter
     * @param agents the players in the game
     * @return scores of each agent as an array of integers
     **/
    playGame(agents) {
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
                    console.log("Player " + gameState.getNextPlayer() + " draws the " + topCard.name + " card.")
                    let act = agents[gameState.getNextPlayer()].playCard(topCard)
                    try {
                        this.stream.write(gameState.update(act, topCard) + '\n')
                    } catch {
                        this.stream.write("ILLEGAL ACTION PERFORMED BY PLAYER " + agents[gameState.getNextPlayer()] + 
                        "(" + gameState.player[0] + ")\nRandom Move Substituted" + '\n')
                        this.randomAgent.newRound(gameState.playerState(gameState.getNextPlayer()))
                        act = this.randomAgent.playCard(topCard)
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

    main() {
        const agents = [new RandomAgent(), new RandomAgent(), new RandomAgent(), new RandomAgent()]
        const loveLetter = new LoveLetter()
        const results = loveLetter.playGame(agents)
        loveLetter.stream.write("The final scores are: \n")
        for (const i in agents) {
            loveLetter.stream.write("\t Agent "+i+", \""+agents[i]+"\":\t "+results[i]+"\n")
        }
    }
}

const loveLetter = new LoveLetter();
loveLetter.main();