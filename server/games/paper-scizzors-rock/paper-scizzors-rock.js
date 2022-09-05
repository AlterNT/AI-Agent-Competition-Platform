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
        this.pending = null
        this.moves = []
    }

    async main() {
        for (const agent of this.agents) {
            this.pending = async () => {}
            const move = await this.pending()
            this.moves.push(move)
        }

        console.log(this.moves)
    }
}

export default PaperScizzorsRock