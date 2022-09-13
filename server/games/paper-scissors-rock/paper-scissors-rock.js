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
        this.turn = null
        this.result = null

        this.pending = null
        this.resolve = null
    }

    async awaitEvent() {
        this.pending = new Promise((resolve) => {
            this.resolve = resolve
        })

        const timeout = setTimeout(() => {
            this.resolve(null)
        }, 3000)

        const move = await this.pending
        clearTimeout(timeout)

        return move
    }

    async main() {
        for (const agent of this.agents) {
            this.turn = agent
            
            const move = await this.awaitEvent()

            if (!move) {
                this.result = `TIMED OUT: ${agent}`
                break
            }

            this.moves.push(move)
        }

        if (!this.result) {
            const move0 = MOVES[this.moves[0]];
            const move1 = MOVES[this.moves[1]];

            const modulo = (move0 - move1 + 3) % 3;
            switch (modulo) {
                case 0:
                    this.result = 'DRAW'
                    break
                case 1:
                    this.result = `WINNER: ${this.agents[0]}`
                    break
                case 2:
                    this.result = `WINNER: ${this.agents[1]}`
                    break
            }
        }

        console.log(this.result)
    }

    finished() {
        return { finished: !!this.result }
    }

    see() {
        return { state: this.moves }
    }
}

export default PaperScizzorsRock