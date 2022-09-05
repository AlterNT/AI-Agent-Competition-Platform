import Agent from './agent.js'

const MOVES = {
    'PAPER': 1,
    'SCISSORS': 2,
    'ROCK': 3,
}

class PaperScizzorsRock {
    constructor(agentTokens) {
        this.agents = agentTokens
        this.moves = []
        this.turn = null;
        this.result = null

        this.pending = null
        this.resolve = null
    }

    async main() {
        for (const agent of this.agents) {
            this.turn = agent
            this.pending = new Promise((resolve) => {
                this.resolve = resolve
            })
            const move = await this.pending
            this.moves.push(move)
        }
        
        const move0 = MOVES[this.moves[0]]
        const move1 = MOVES[this.moves[1]]

        if (move0 == move1) {
            this.result = 'DRAW'

        } else if (move0 + 1 % 3 == move1 % 3) {
            this.result = `WINNER: ${this.agents[0]}`

        } else {
            this.result = `WINNER: ${this.agents[1]}`
        }

        console.log(this.result)
    }
}

export default PaperScizzorsRock