import random
import time
import requests

from agentIO import AgentIO

MOVES = ['PAPER', 'SCISSORS', 'ROCK']

def play_game(agentIO):
    print('attempting to join lobby')
    try:
        while not agentIO.join_lobby():
            time.sleep(1)
            print('join lobby unsuccessful... attempting to join again')
    except requests.exceptions.ConnectionError:
        print('server unreachable, reattempting to join lobby:')
        print('\tcheck that the game server is running and you have a working connection')
        return

    print('joined lobby')

    try:
        while True:
            if random.randint(1, 5) == 1:
                print('TIMING OUT', agentIO.agentToken)
                time.sleep(5)

            print('will now await turn')
            a = not agentIO.turn()
            print('!!!', a)
            while a:
                finished_json = agentIO.receive_method('finished').json()
                cond = not finished_json or finished_json['finished']
                print(cond, finished_json)
                if cond:
                    print('finished game')
                    return

                print('waiting for turn...')
                time.sleep(1)
                a = not agentIO.turn()

            move = random.choice(MOVES)
            print(f'move = {move}')
            agentIO.send_action(move)

    except requests.exceptions.ConnectionError:
        ...
        print('disconnected from server... aborting and starting a new game')
    print()

def main():
    agentIO = AgentIO(f'token{random.randrange(1000)}')

    while True:
        play_game(agentIO)

if __name__ == '__main__':
    main()
