import sys
import time
import requests

import love_letter
import paper_scissors_rock

def main():
    agent_token = sys.argv[1]
    game = sys.argv[2]
    
    # create agent for selected game
    if game == 'love-letter':
        agent = love_letter.RandomAgent(agent_token)
    if game == 'paper-scissors-rock':
        agent = paper_scissors_rock.RandomAgent(agent_token)

    # multiple games loop
    while True:
        try:
            joined_lobby = agent.agent_io.join_lobby()

            if (joined_lobby):
                print('joined lobby')

                # wait for game to start
                while not agent.agent_io.game_started():
                    pass

                print('game started')
                
                # main game loop
                while not agent.agent_io.game_finished():
                    is_turn = agent.agent_io.is_turn()

                    if (is_turn):
                        print('making move')
                        agent.state = agent.agent_io.get_state()
                        move = agent.move()
                        agent.agent_io.send_action(move)

                    time.sleep(0.5)
        except requests.exceptions.ConnectionError:
            print('Cannot connect to server,\nplease check that it\'s running')
            exit(1)

        time.sleep(2)

if __name__ == '__main__':
    main()
