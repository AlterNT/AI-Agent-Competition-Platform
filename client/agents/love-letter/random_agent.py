from AgentIO import AgentIO
import random
import time
import sys

class RandomAgent:
    def __init__(self, token):
        self.agentIO = AgentIO(token)
        self.token = token
        self.state = None

        print(f'Starting agent with token: {self.token}')
        
    def initialiseState(self):
        index = self.agentIO.getPlayerIndexInitial()
        self.state = self.agentIO.getState(index)
        
    def getState(self):
        self.state = self.agentIO.getState(self.state['player'])
    
    def playCard(self):
        self.getState()
        player_index = self.state['player']
        card = self.agentIO.getTopCard()
        action = None
        play = None
        while not self.agentIO.legalAction(player_index, action, card):
            play = random.choice([card, self.agentIO.getCard(player_index)])
            target = random.randrange(0, self.state['num'])
            try:
                if play['name'] == 'Guard':
                    guess = random.choice(['Guard', 'Priest', 'Baron', 'Handmaid', 'Prince', 'King', 'Countess'])
                    action = {
                        'action': 'playGuard',
                        'params': [player_index, target, guess]
                    }
                elif play['name'] == 'Priest':
                    action = {
                        'action': 'playPriest',
                        'params': [player_index, target]
                    }
                elif play['name'] == 'Baron':
                    action = {
                        'action': 'playBaron',
                        'params': [player_index, target]
                    }
                elif play['name'] == 'Handmaid':
                    action = {
                        'action': 'playHandmaid',
                        'params': [player_index]
                    }
                elif play['name'] == 'Prince':
                    action = {
                        'action': 'playPrince',
                        'params': [player_index, target]
                    }
                elif play['name'] == 'King':
                    action = {
                        'action': 'playKing',
                        'params': [player_index, target]
                    }
                elif play['name'] == 'Countess':
                    action = {
                        'action': 'playCountess',
                        'params': [player_index]
                    }
                else:
                    action = None
            except:
                pass

        self.agentIO.send_action(action)
    
def main():
    token = len(sys.argv) > 1 and sys.argv[1] or f'token{random.randrange(1000)}'
    agent = RandomAgent(token)

    while True: # multiple games
        agent.agentIO.join_lobby()
        
        while True: # multiple moves
        
            while True: # wait for turn
                is_turn = agent.agentIO.is_turn()
                time.sleep(1)
                
                if is_turn:
                    break
            
            if agent.state == None:
                agent.initialiseState()
                
            agent.playCard()
        
if __name__ == "__main__":
    main()
