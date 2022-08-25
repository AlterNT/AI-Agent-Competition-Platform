import sys
import random
import client_io

class Agent:
    MOVES = ['PAPER', 'SCIZZORS', 'ROCK']

    def __init__(self, token):
        self.token = token
        self.client_io = client_io.ClientIO()

    def move(self):
        random_number = random.randrange(0, 3)
        move = self.MOVES[random_number]
        self.client_io.agent_out(move)

def main():
    agent = Agent('token')
    agent.move()


if __name__ == '__main__':
    main()