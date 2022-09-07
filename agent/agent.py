import random
import time
import requests

from agentIO import AgentIO

MOVES = {
    1: 'PAPER',
    2: 'SCISSORS',
    3: 'ROCK',
}

def play_game(agentIO):
        print('attempting to join lobby')
        while not agentIO.join_lobby():
            print('server unreachable, reattempting to join lobby:')
            print('\tcheck that the game server is running and you have a working connection')
            time.sleep(1)

        print('joined lobby')

        try:
            print('will now await turn')
            while not agentIO.turn():
                finished_json = agentIO.receive_method('finished').json()
                if finished_json and finished_json['finished']:
                    return
                print('waiting for turn...')
                time.sleep(1)

            if random.randint(1, 5) == 1:
                print('TIMING OUT', agentIO.agentToken)
                time.sleep(5)

            print('making move')
            random_move_int = random.randint(1, 3)
            move = MOVES[random_move_int]
            print(f'move = {move}')

            print('playing move')
            agentIO.send_action(move)
            print('played move')

            print('finished game\n')
        except requests.exceptions.ConnectionError:
            print('disconnected from server... aborting and starting a new game\n')

def main():
    agentIO = AgentIO(f'token{random.randrange(1000)}')

    while True:
        play_game(agentIO)

if __name__ == '__main__':
    main()
