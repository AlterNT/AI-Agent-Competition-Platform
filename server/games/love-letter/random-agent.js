import Action from './action.js'
import Agent from './agent.js'
import Card from './card.js'

import seedrandom from 'seedrandom'

class RandomAgent {
    constructor(name) {
        this.random = seedrandom()
        this.name = name
        this.state = null
        this.index = null
    }

    newRound(state) {
        this.state = state
        this.index = this.state.player
    }

    see(action, state) {
        this.state = state
    }

    playCard(card) {
        let action = null
        let play = null
        while (!this.state.legalAction(action, card)) {
            if (this.random.double() < 0.5) { 
                play = card 
            }
            else { 
                play = this.state.getCard(this.index) 
            }
            const target = parseInt(this.random.double() * this.state.num)
            try {
                switch (play.name) {
                    case Card.GUARD.name:
                        const randomCard = Object.values(Card)[parseInt(this.random.double() * 7) + 1]
                        action = Action.playGuard(this.index, target, randomCard)
                        return action
                    case Card.PRIEST.name:
                        action = Action.playPriest(this.index, target)
                        return action
                    case Card.BARON.name:
                        action = Action.playBaron(this.index, target)
                        return action
                    case Card.HANDMAID.name:
                        action = Action.playHandmaid(this.index)
                        return action
                    case Card.PRINCE.name:
                        action = Action.playPrince(this.index, target)
                        return action
                    case Card.KING.name:
                        action = Action.playKing(this.index, target)
                        return action
                    case Card.COUNTESS.name:
                        action = Action.playCountess(this.index)
                        return action
                    default:
                        action = null
                }
            } catch { }
        } 

        return action
    }
}

export default RandomAgent