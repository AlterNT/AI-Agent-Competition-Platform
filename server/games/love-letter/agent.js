import IAgent from "../i-agent.js";

class Agent extends IAgent {

    state;

    constructor(token) {
        super(token);
    }

    newRound(state) {
        this.state = state;
    }

    see(action, state) {
        this.state = state;
    }

    playCard(card) {
        
    }

    getState() {
        const agentState = {...this.state};
        delete agentState.agents;
        return agentState;
    }
    
}

export default Agent;