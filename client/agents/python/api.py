import requests
from zmq import SERVER

SERVER_API = 'http://localhost:8080'

class API:
    def __init__(self, agent_token, server = SERVER_API):
        self.agent_token = agent_token
        self.server = server
        
    def join_lobby(self, game_id):
        try:
            response = requests.post(self.server + '/api/join', json={
                'agentToken': self.agent_token,
                'gameID': game_id
            })
            data = response.json()
            success = data['success']
            return success
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
    
    def game_started(self):
        try:
            response = requests.get(self.server + '/api/started', params={
                'agentToken': self.agent_token
            })
            data = response.json()
            game_started = data['gameStarted']
            return game_started
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def game_finished(self):
        try:
            response = requests.get(self.server + '/api/finished', params={
                'agentToken': self.agent_token
            })
            data = response.json()
            game_finshed = data['gameFinished']
            return game_finshed
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def is_turn(self):
        try:
            response = requests.get(self.server + '/api/turn', params={
                'agentToken': self.agent_token
            })
            data = response.json()
            is_turn = data['isTurn']
            return is_turn
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def get_state(self):
        try:
            response = requests.get(self.server + '/api/state', params={
                'agentToken': self.agent_token
            })
            data = response.json()
            state = data['state']
            return state
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def send_action(self, action):
        try:
            response = requests.post(self.server + '/api/action', json={
                'agentToken': self.agent_token,
                'action': action
            })
            data = response.json()
            success = data['success']
            return success
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def request_method(self, keys, method, params):
        try:
            response = requests.get(self.server + '/api/method', json={
                'agentToken': self.agent_token,
                'keys': keys,
                'method': method,
                'params': params
            })
            data = response.json()
            result = data['result']
            return result
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        