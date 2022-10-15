from paper_scissors_rock.agent_io import AgentIO

import random

MOVES = ['PAPER', 'SCISSORS', 'ROCK']

class RandomAgent:
    def __init__(self, agent_token, server):
        self.agent_io = AgentIO(agent_token, server)
        self.agent_token = agent_token
        self.state = None
    
    def move(self):
        random_move_int = random.randrange(0, 3)
        move = MOVES[random_move_int]
        
        return move