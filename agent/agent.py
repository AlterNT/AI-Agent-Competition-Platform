import random
from agentIO import AgentIO
from random import randrange

class Agent:
    MOVES = ['PAPER', 'SCIZZORS', 'ROCK']

    def __init__(self, token):
        self.token = token
        self.client_io = client_io.ClientIO()

    def command(self):
        message = self.client_io.client_in()
        command = message.replace('CLIENT-OUT: ', '')
        return command

    def move(self):
        random_number = random.randrange(0, 3)
        move = self.MOVES[random_number]
        self.client_io.client_out(move)

def main():
    # initialise agent
    # agent = Agent('token')
    
    # # wait for command
    # command = agent.command()

    # if command == 'ACTION':
    #     agent.move()

    ai = AgentIO(f'token{randrange(1000)}')
    a = ai.join_lobby()
    print(a)
    

if __name__ == '__main__':
    main()