import Action from './action.js';
import Card from './card.js';
import seedrandom from 'seedrandom';
import IAgent from '../i-agent.js';

class RandomAgent extends IAgent {

    random;
    state = null;
    index = null;

    constructor(token = 'rando', random = seedrandom()) {
        super(token);
        this.random = random;
    }

    newRound(state) {
        this.state = state;
        this.index = this.state.getPlayerIndex();
    }

    see(action, state) {
        this.state = state;
    }

    getState() {
        const agentState = { ...this.state };
        delete agentState.agents;
        return agentState;
    }

    playCard(card) {
        let action = null;
        let play = null;
        while (!this.state.legalAction(action, card)) {
            if (this.random.double() < 0.5) {
                play = card;
            }
            else {
                play = this.state.getCard(this.index);
            }
            const target = parseInt(this.random.double() * this.state.num);
            try {
                switch (play.name) {
                    case Card.GUARD.name:
                        const randomCard = Object.values(Card)[parseInt(this.random.double() * 7) + 1];
                        action = Action.playGuard(this.index, target, randomCard);
                        break
                    case Card.PRIEST.name:
                        action = Action.playPriest(this.index, target);
                        break;
                    case Card.BARON.name:
                        action = Action.playBaron(this.index, target);
                        break;
                    case Card.HANDMAID.name:
                        action = Action.playHandmaid(this.index);
                        break;
                    case Card.PRINCE.name:
                        action = Action.playPrince(this.index, target);
                        break;
                    case Card.KING.name:
                        action = Action.playKing(this.index, target);
                        break;
                    case Card.COUNTESS.name:
                        action = Action.playCountess(this.index);
                        break;
                    default:
                        action = null;
                }
            } catch { }
        }

        return action;
    }
}

export default RandomAgent;