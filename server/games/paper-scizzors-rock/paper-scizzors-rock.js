import Agent from './agent.js'

class PaperScizzorsRock {
    static PAPER = 'SCIZZORS'
    static SCIZZORS = 'SCIZZORS'
    static ROCK = 'ROCK'

    constructor(agentTokens) {
        this.agents = []
        for (const agentToken of agentTokens) {
            this.agents.push(new Agent(agentToken))
        }

        this.moves = []
    }

    async main() {
        for (const agent of this.agents) {
            const move = agent.move()
        }
    }
}

async function main() {
    const game = new PaperScizzorsRock()
    console.log('test')
}

main()