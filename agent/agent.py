import random
import time

from agentIO import AgentIO

MOVES = {
    1: 'PAPER',
    2: 'SCISSORS',
    3: 'ROCK',
}

def main():
    agentIO = AgentIO(f'token{random.randrange(1000)}')
    
    while True:
        print('joining lobby')
        agentIO.join_lobby()
        print('joined lobby')
        
        print('waiting for turn...')
        while not agentIO.turn():
            time.sleep(1)
            print('waiting for turn...')
            
        print('making move')
        random_move_int = random.randint(1, 3)
        move = MOVES[random_move_int]
        print(f'move = {move}')
        
        print('playing move')
        agentIO.send_action('MOVE', move)
        print('played move')

if __name__ == '__main__':
    main()
