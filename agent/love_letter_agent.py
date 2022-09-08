from agentIO import AgentIO
import random

class Agent:
    def __init__(self, token):
        self.agentIO = AgentIO(token)
        self.token = token
        self.state = None
        self.index = None
        
    # methods used by random agent (can possibly be moved to another file (specific for love-letter))
    def get_player_index(self):
        keys = ['agents', self.token, 'state']
        method = 'getPlayerIndex'
        params = []
        return self.agentIO.request_method(keys, method, params)
    
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

    def newRound(self, state):
        pass

    def see(self, action, state):
        pass
    
    def playCard(self, card):
        pass
    
agent = Agent('asdf')
agent.get_player_index()