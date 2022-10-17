import IAgent from "../i-agent.js";
import Action from "./action.js";

class Agent extends IAgent {

    index;
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

    async playCard(card) {
        const action = await this.awaitEvent()
        if (action === null) return null;
        return Action[action.action](...action.params);
    }

    /**
     * @returns The state corresponding to this agent.
     */
    getState() {
        const agentState = {...this.state};
        delete agentState.agents;
        return agentState;
    }
    
}

export default Agent;