from love_letter.agent_io import AgentIO

import random

class RandomAgent:
    def __init__(self, agent_token, server):
        self.agent_io = AgentIO(agent_token, server)
        self.agent_token = agent_token
        self.state = None
    
    def move(self):
        player_index = self.state['player']
        card = self.agent_io.get_top_card()
        action = None
        play = None
        while not self.agent_io.legal_action(player_index, action, card):
            play = random.choice([card, self.agent_io.get_card(player_index)])
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

        return action