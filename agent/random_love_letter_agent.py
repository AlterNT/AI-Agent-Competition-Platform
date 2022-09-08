from agentIO import AgentIO
import random

class RandomAgent:
    def __init__(self, token):
        self.agentIO = AgentIO(token)
        self.token = token
        self.state = None
        self.index = None
        
    def legal_action(self, action, card):
        keys = ['agents', self.token, 'state']
        method = 'legalAction'
        params = [action, card]
        return self.agentIO.request_method(keys, method, params)
    
    def get_card(self):
        keys = ['agents', self.token, 'state']
        method = 'getCard'
        params = [self.index]
        return self.agentIO.request_method(keys, method, params)
    
    def playCard(self, card):
        action = None
        play = None
        while not self.legal_action(action, card):
            if random.random() < 0.5: 
                play = card 
            else:
                play = self.get_card(self.index) 
            
            target = int(random.random() * self.state['num'])
            try:
                switch (play.name) {
                    case Card.GUARD.name:
                        const randomCard = Object.values(Card)[parseInt(this.random.double() * 7) + 1]
                        action = Action.playGuard(this.index, target, randomCard)
                        break
                    case Card.PRIEST.name:
                        action = Action.playPriest(this.index, target)
                        break
                    case Card.BARON.name:
                        action = Action.playBaron(this.index, target)
                        break
                    case Card.HANDMAID.name:
                        action = Action.playHandmaid(this.index)
                        break
                    case Card.PRINCE.name:
                        action = Action.playPrince(this.index, target)
                        break
                    case Card.KING.name:
                        action = Action.playKing(this.index, target)
                        break
                    case Card.COUNTESS.name:
                        action = Action.playCountess(this.index)
                        break
                    default:
                        action = null
                }
            except:
                pass
        } 

        return action
    
agent = Agent('asdf')
agent.get_player_index()