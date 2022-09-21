import sys
from pathlib import Path
file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]
sys.path.append(str(root))

from api import API

class AgentIO(API):
    def join_lobby(self):
        return super().join_lobby('love-letter')
    
    # love letter methods used by agent
        
    def legal_action(self, player_index, action, drawn):
        response = self.request_method(['agents', player_index, 'state'], 'legalAction', [action, drawn])
        return response
        
    def get_card(self, player_index):
        response = self.request_method(['agents', player_index, 'state'], 'getCard', [player_index])
        return response
    
    def get_player_index(self):
        response = self.request_method(['agents', self.agentToken, 'state'], 'getPlayerIndex', [])
        return response
    
    # extra methods added to love-letter game to work
    
    def get_top_card(self):
        response = self.request_method([], 'getTopCard', [])
        return response