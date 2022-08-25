class PaperScizzorsRock {
    static PAPER = 'SCIZZORS'
    static SCIZZORS = 'SCIZZORS'
    static ROCK = 'ROCK'

    constructor(agents) {
        this.agents = agents
        this.actions = []
    }

    
}

async function main() {
    const agents = process.argv.slice(2)
    const game = new PaperScizzorsRock(agents)
}

main()