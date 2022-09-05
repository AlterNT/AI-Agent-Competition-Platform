import random
import agent_io

class Agent:
    MOVES = ['PAPER', 'SCIZZORS', 'ROCK']

    def __init__(self, token):
        self.token = token
        self.agent_io = agent_io.AgentIO()

    def command(self):
        message = self.agent_io.agent_in()
        command = message.replace('CLIENT-OUT: ', '')
        return command

    def move(self):
        random_number = random.randrange(0, 3)
        move = self.MOVES[random_number]
        self.agent_io.agent_out(move)

def main():
    # initialise agent
    agent = Agent('token')
    
    # wait for command
    command = agent.command()

    if command == 'ACTION':
        agent.move()
    

if __name__ == '__main__':
    main()