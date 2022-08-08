import os
import subprocess
import requests
import json
from subprocess import Popen, PIPE
from pathlib import Path

class Client:
    PATH = (Path(os.path.abspath(__file__)) / '..').resolve()
    ACCEPTED_FILETYPES = ['py', 'java']

    def __init__(self, server_url='http://localhost:8080'):
        self.game = None
        self.agent_process = None
        self.agent_filepath = None
        self.server_url = server_url

    def execute_agent(self, agent_filepath):
        # if the agent is a java file will compile the file and communicate with it
        if agent_filepath.name.endswith('.java'):
            subprocess.run(f'javac "{agent_filepath}"', shell=True)
            self.agent_process = Popen(['java', agent_filepath], stdin=PIPE, stdout=PIPE, stderr=PIPE)

        # if the agent is a python file (none currently)
        elif  agent_filepath.name.endswith('.py'):
            self.agent_process = Popen(['python3', agent_filepath], stdin=PIPE, stdout=PIPE, stderr=PIPE)

        self.agent_filepath = agent_filepath

    def load_agent(self):
        # get list of all filenames in the Agents folder
        # all_filenames = os.listdir(Client.PATH / 'Agents')
        agents_dir = Client.PATH / 'Agents'

        agent_filenames = []
        for filetype in Client.ACCEPTED_FILETYPES:
            files_of_type = list(agents_dir.glob(f'*.{filetype}'))
            agent_filenames.extend(files_of_type)

        # print list of agent filenames to choose
        print('AGENTS: ')
        for i, file in enumerate(agent_filenames):
            print(f'{i}. {file.name}')

        # requrest user to input the number of the agent atm
        agent_index = int(input('\nCHOOSE AGENT: '))
        agent_filename = agent_filenames[agent_index]
        agent_filepath = Client.PATH / 'Agents' / agent_filename

        self.execute_agent(agent_filepath)

    def load_game(self):
        data = requests.get(f'{self.server_url}/games')
        games = json.loads(data.json())

        print('GAMES:')
        for i, game in enumerate(games):
            print(f'{i}. {game["name"]}')

        game_index = int(input('\nCHOOSE GAME: '))
        self.game = games[game_index]

def main():
    game_client = Client()
    game_client.load_game()
    game_client.load_agent()

    print(f'Playing {game_client.game["name"]} using agent {game_client.agent_filepath.name}')

if __name__ == '__main__':
    main()