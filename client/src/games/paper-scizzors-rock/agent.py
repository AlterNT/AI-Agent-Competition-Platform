import sys
import random
import client_io

class Agent:
    MOVES = ['PAPER', 'SCIZZORS', 'ROCK']

    def __init__(self, token):
        self.token = token

    def move(self):
        random_number = random.randrange(0, 3)
        print('AGENT-IO: ' + self.MOVES[random_number])

def main():
    agent = Agent('token')
    agent.move()


if __name__ == '__main__':
    main()