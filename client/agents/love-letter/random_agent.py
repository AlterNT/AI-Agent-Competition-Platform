from AgentIO import AgentIO
import random
import time

class RandomAgent:
    def __init__(self, token):
        self.agentIO = AgentIO(token)
        self.token = token
        self.state = None
        self.index = None
        
    def getState(self):
        self.state = self.agentIO.getState()
    
    def playCard(self):
        self.getState()
        card = self.agentIO.getTopCard()
        action = None
        play = None
        while not self.agentIO.legalAction(action, card):
            play = random.choice(card, self.agentIO.getCard(self.index))
            target = random.randrange(0, self.state['num'])
            try:
                if play == 'GUARD':
                    guess = random.choice(['GUARD', 'PRIEST', 'BARON', 'HANDMAID', 'PRINCE', 'KING', 'COUNTESS'])
                    action = {
                        'action': 'playGuard',
                        'params': [target, guess]
                    }
                if play == 'PRIEST':
                    action = {
                        'action': 'playPriest',
                        'params': [target]
                    }
                if play == 'BARON':
                    action = {
                        'action': 'playBaron',
                        'params': [target]
                    }
                if play == 'HANDMAID':
                    action = {
                        'action': 'playHandmaid',
                        'params': []
                    }
                if play == 'PRINCE':
                    action = {
                        'action': 'playPrince',
                        'params': [target]
                    }
                if play == 'KING':
                    action = {
                        'action': 'playKing',
                        'params': [target]
                    }
                if play == 'COUNTESS':
                    action = {
                        'action': 'playCountess',
                        'params': []
                    }
                else:
                    action = None
            except:
                pass

        self.agentIO.send_action(action)
    
def main():
    token = f'token{random.randrange(1000)}'
    agent = RandomAgent(token)

    while True: # multiple games
        agent.agentIO.join_lobby()
        
        while True: # multiple moves
        
            while True: # wait for turn
                is_turn = agent.agentIO.is_turn()
                print(is_turn)
                time.sleep(1)
                
                if is_turn:
                    break
            
            agent.playCard()
        
        time.sleep(1)
        
if __name__ == "__main__":
    main()
