import sys
from pathlib import Path
file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]
sys.path.append(str(root))

from API import API

class AgentIO(API):
    def join_lobby(self):
        return super().join_lobby('paper-scissors-rock')
    
        
        
    