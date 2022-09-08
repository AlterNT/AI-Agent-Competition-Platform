import random
import time
import requests

from agentIO import AgentIO

MOVES = ['PAPER', 'SCISSORS', 'ROCK']

def play_game(agentIO):
    print('attempting to join lobby')
    try:
        if not agentIO.join_lobby():
            print('already in a game?... attempting to join again')
            time.sleep(1)
            return
    except requests.exceptions.ConnectionError:
        print('server unreachable, reattempting to join lobby:')
        print('\tcheck that the game server is running and you have a working connection')
        time.sleep(1)
        return

    print('joined lobby')

    try:
        agentIO.await_game_start()
    except requests.exceptions.ConnectionError:
        print('disconnected from server, exiting game\n')
        return

    try:
        while True:
            if random.randint(1, 10) == 1:
                print('TIMING OUT', agentIO.agentToken)
                time.sleep(5)

            print('waiting for turn...')
            while not agentIO.turn():
                if agentIO.game_finished():
                    print('finished game')
                    return

                time.sleep(1)

            agentIO.see()
            move = random.choice(MOVES)
            print(f'move = {move}')
            agentIO.send_action(move)

    except requests.exceptions.ConnectionError:
        print('disconnected from server... aborting and starting a new game')
        return

def main():
    agentIO = AgentIO(f'token{random.randrange(1000)}')

    while True:
        play_game(agentIO)
        print()

if __name__ == '__main__':
    main()
