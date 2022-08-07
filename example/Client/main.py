import os
import subprocess
import requests
import json
from subprocess import Popen, PIPE

PATH = os.path.dirname(os.path.abspath(__file__))

def load_agent():
    # get list of all filenames in the Agents folder
    agent_filenames = os.listdir(PATH + '/Agents')
    
    # print list of agent filenames to choose
    print('AGENTS: ')
    for i in range(len(agent_filenames)):
        print(f'{i}. {agent_filenames[i]}')
        
    # requrest user to input the number of the agent atm
    agent_index = int(input('\nCHOOSE AGENT: '))
    agent_filename = agent_filenames[agent_index]
    agent_filepath = PATH + '/Agents/' + agent_filename
    
    # if the agent is a java file will compile the file and communicate with it
    if agent_filepath[-4:] == 'java':
        subprocess.run(f'javac "{agent_filepath}"', shell=True)
        agent_process = Popen(['java', agent_filepath], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    
    # if the agent is a python file (none currently)
    elif agent_filepath[-2:] == 'py':
        agent_process = Popen(['python3', agent_filepath], stdin=PIPE, stdout=PIPE, stderr=PIPE)
        
    return agent_filename, agent_process
        
def load_game():
    data = requests.get('http://localhost:8080/games')
    games = json.loads(data.json())
    
    print('GAMES:')
    for i in range(len(games)):
        print(f'{i}. {games[i]["name"]}')
    
    game_index = int(input('\nCHOOSE GAME: '))
    game = games[game_index]

    return game

def main():
    game = load_game()
    agent_filename, agent_process = load_agent()
    
    print(f'Playing {game["name"]} using agent {agent_filename}')
    
    
    

if __name__ == '__main__':
    main()