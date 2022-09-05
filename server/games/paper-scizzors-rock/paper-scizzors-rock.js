import Agent from './agent.js'

class PaperScizzorsRock {
    static PAPER = 'SCIZZORS'
    static SCIZZORS = 'SCIZZORS'
    static ROCK = 'ROCK'

    constructor(agentTokens) {
        this.activeAgent = null;
        this.agents = []
        for (const agentToken of agentTokens) {
            this.agents.push(new Agent(agentToken))
        }

        this.moves = []
    }

    async main() {
        for (const agent of this.agents) {
            this.activeAgent = agent
            const move = await agent.move()
            this.moves.push(move)
        }

        console.log(this.moves)
    }
}

export default PaperScizzorsRock