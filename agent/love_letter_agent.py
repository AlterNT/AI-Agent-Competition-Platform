from agentIO import AgentIO
import random

class RandomAgent:
    def __init__(self, name='rando', random=random()):
        self.random = random
        self.name = name
        self.state = None
        self.index = None

    def newRound(self, state):
        pass

    def see(self, action, state):
        pass
    
    def playCard(self, card):
        pass