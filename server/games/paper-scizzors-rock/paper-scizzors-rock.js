import Agent from './agent.js'

class PaperScizzorsRock {
    static PAPER = 'SCIZZORS'
    static SCIZZORS = 'SCIZZORS'
    static ROCK = 'ROCK'

    ACTIONS = {
        'PAPER': 1,
        'SCIZZORS': 2,
        'ROCK': 3,
    }

    constructor(agentTokens) {
        this.activeAgent = null;
        this.agents = []
        for (const agentToken of agentTokens) {
            this.agents.push(new Agent(agentToken))
        }
        this.pending = null
        this.resolve = null
        this.moves = []
        this.result = null
    }

    async main() {
        for (const agent of this.agents) {
            this.activeAgent = agent
            this.pending = new Promise((resolve) => {
                this.resolve = resolve
            })
            const move = await this.pending
            this.moves.push(move)
        }

        const move0 = ACTIONS[this.moves[0]]
        const move1 = ACTIONS[this.moves[1]]

        if (move0 == move1) {
            this.result = null

        } else if (move0 + 1 % 3 == move1 % 3) {
            this.result = this.agents[0]

        } else {
            this.result = this.agents[1]
        } 
    }
}

export default PaperScizzorsRock