import sys
from pathlib import Path
file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]
sys.path.append(str(root))

from API import API

class AgentIO(API):
    def join_lobby(self):
        return super().join_lobby('love-letter')
        
    # Below is a list of all possible calls a user can make from the client end on the state object.
        # legalaction 
        # getCard
        # getPlayerIndex
        # eliminated
        # getNextPlayer
        # name
        # decksize
        # unseenCards
        # score
        
    def legalAction(self, player_index, action, drawn):
        response = self.request_method(['agents', player_index, 'state'], 'legalAction', [action, drawn])
        return response
        
    def getCard(self, player_index):
        response = self.request_method(['agents', player_index, 'state'], 'getCard', [player_index])
        return response
    
    def getPlayerIndex(self):
        response = self.request_method(['agents', self.agentToken, 'state'], 'getPlayerIndex', [])
        return response
    
    def eliminated(self, player):
        response = self.request_method(['agents', self.agentToken, 'state'], 'eliminated', [player])
        return response
    
    def name(self, player_index):
        response = self.request_method(['agents', self.agentToken, 'state'], 'name', [player_index])
        return response
    
    def decksize(self):
        response = self.request_method(['agents', self.agentToken, 'state'], 'decksize', [])
        return response
    
    def unseenCards(self):
        response = self.request_method(['agents', self.agentToken, 'state'], 'unseenCards', [])
        return response
    
    def getTopCard(self):
        response = self.request_method([], 'getTopCard', [])
        return response
    
    def getState(self, player_index):
        response = self.request_method(['agents', player_index], 'getState', [])
        return response
    
    def getPlayerIndexInitial(self):
        response = self.request_method([], 'getPlayerIndexInitial', [self.agentToken])
        return response
    
    def score():
        pass