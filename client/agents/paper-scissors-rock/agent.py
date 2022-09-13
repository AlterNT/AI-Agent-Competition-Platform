import random
import time

from AgentIO import AgentIO

MOVES = ['PAPER', 'SCISSORS', 'ROCK']

def main():
    agentIO = AgentIO(f'token{random.randrange(1000)}')

    while True:
        agentIO.join_lobby()
        
        while True:
            is_turn = agentIO.is_turn()
            time.sleep(1)
            
            if is_turn:
                break
            
        random_move_int = random.randrange(0, 3)
        move = MOVES[random_move_int]
        agentIO.send_action(move)    
        
        time.sleep(1)

if __name__ == '__main__':
    main()
