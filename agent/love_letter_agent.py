from agentIO import AgentIO
import random

class RandomAgent:
    def __init__(self, name='rando', random=random()):
        self.random = random
        self.name = name
        self.state = None
        self.index = None

    def newRound(self, state):
        self.state = state
        self.index = self.state.getPlayerIndex()

    def see(self, action, state):
        self.state = state

    def playCard(self, card):
        action = None
        play = None
        while not self.state.legalAction(action, card):
            if self.random.double() < 0.5:
                play = card 
            else:
                play = self.state.getCard(self.index) 
            
            target = int(self.random.double() * self.state.num)

            try:
                if play.name == Card.GUARD.name:
                    randomCard = Object.values(Card)[parseInt(self.random.double() * 7) + 1]
                    action = Action.playGuard(self.index, target, randomCard)
                elif play.name == Card.PRIEST.name:
                    action = Action.playPriest(self.index, target)
                    case Card.BARON.name:
                        action = Action.playBaron(self.index, target)
                        break
                    case Card.HANDMAID.name:
                        action = Action.playHandmaid(self.index)
                        break
                    case Card.PRINCE.name:
                        action = Action.playPrince(self.index, target)
                        break
                    case Card.KING.name:
                        action = Action.playKing(self.index, target)
                        break
                    case Card.COUNTESS.name:
                        action = Action.playCountess(self.index)
                        break
                    default:
                        action = null
                }
            } catch { }
        } 

        return action
    }
}

export default RandomAgent