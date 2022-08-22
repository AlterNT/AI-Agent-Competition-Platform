from random import random 

class LoveLetterAgent:
    def __init__(self, player_index, state):
        self.player_index = player_index
        self.state = state 
    
    def play_card(self):
        cards = self.state.cards()
        players = self.state.players().remove(player_index)
        
        random_card = random.choice(cards)
        random_player = random.choice(players)
        
        if random_card == "GUARD":
            print(random_card, random_player, random_card)
        
        if random_card == "PRIEST":
            print(random_card, random_player)

        if random_card == "BARON":
            print(random_card, random_player) 

        if random_card == "HANDMAID":
            print(random_card)

        if random_card == "PRINCE":
            print(random_card, random_player)

        if random_card == "KING":
            print(random_card, random_player)

        if random_card == "COUNTESS":
            print(random_card)
            
        pass