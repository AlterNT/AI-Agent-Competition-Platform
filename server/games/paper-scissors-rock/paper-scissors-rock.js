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
        let count = 0;
        for (const agent of this.agents) {
            count++;
            this.turn = agent
            this.pending = new Promise((resolve) => {
                this.resolve = resolve
            })

            const resolve = ((resolve, timeoutStart) => () => {
                if (count === timeoutStart) {
                    resolve(null);
                    this.resolve = () => {};
                }
            })(this.resolve, count);

            setTimeout(resolve, 2000);

            const move = await this.pending
            this.moves.push(move)
        }

        if (this.moves[0] || this.moves[1]) {
            if (this.moves[0] && this.moves[1]) {
                const move0 = MOVES[this.moves[0]];
                const move1 = MOVES[this.moves[1]];

                const modulo = (move0 - move1 + 3) % 3;
                switch (modulo) {
                    case 0:
                        this.result =  'DRAW';
                        break
                    case 1:
                        this.result =  `WINNER: ${this.agents[0]}`;
                        break
                    case 2:
                        this.result =  `WINNER: ${this.agents[1]}`;
                        break
                }
            } else if (this.moves[0]) {
                this.result = `TIMED OUT: ${this.agents[1]}`;
            } else {
                this.result = `TIMED OUT: ${this.agents[0]}`;
            }
        } else {
            this.result = 'BOTH TIMED OUT'
        }

        console.log(this.result);
    }
}

export default PaperScizzorsRock