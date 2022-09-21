from paper_scissors_rock.agent_io import AgentIO

import random

class Agent:
    def __init__(self, token):
        self.agentIO = AgentIO(token)
        self.token = token
        self.state = None
        
    def updateState(self):
        self.state = self.agentIO.getState()
    
    def move(self):
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