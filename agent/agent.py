import random
import time
import requests

from agentIO import AgentIO

MOVES = {
    1: 'PAPER',
    2: 'SCISSORS',
    3: 'ROCK',
}

def main():
    agentIO = AgentIO(f'token{random.randrange(1000)}')

    while True:
        print('attempting to join lobby')
        while not agentIO.join_lobby():
            print('server unreachable, reattempting to join lobby:')
            print('\tcheck that the game server is running and you have a working connection')
            time.sleep(1)

        print('joined lobby')

        try:
            print('will now await turn')
            while not agentIO.turn():
                print('waiting for turn...')
                time.sleep(1)

            print('making move')
            random_move_int = random.randint(1, 3)
            move = MOVES[random_move_int]
            print(f'move = {move}')

            print('playing move')
            agentIO.send_action(move)
            print('played move')

            print('finished game\n')
        except requests.exceptions.ConnectionError:
            print('disconected from server... aborting and starting a new game\n')

if __name__ == '__main__':
    main()
