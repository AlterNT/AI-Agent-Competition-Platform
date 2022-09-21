import requests

SERVER_API = 'http://localhost:8080/api'

class API:
    def __init__(self, agent_token):
        self.agent_token = agent_token
        
    def join_lobby(self, game_id):
        try:
            response = requests.post(SERVER_API + '/join', json={
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
            response = requests.get(SERVER_API + '/started', params={
                'agentToken': self.agent_token
            })
            data = response.json()
            game_started = data['gameStarted']
            return game_started
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def game_finished(self):
        try:
            response = requests.get(SERVER_API + '/finished', params={
                'agentToken': self.agent_token
            })
            data = response.json()
            game_finshed = data['gameFinished']
            return game_finshed
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def is_turn(self):
        try:
            response = requests.get(SERVER_API + '/turn', params={
                'agentToken': self.agent_token
            })
            data = response.json()
            is_turn = data['isTurn']
            return is_turn
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def get_state(self):
        try:
            response = requests.get(SERVER_API + '/state', params={
                'agentToken': self.agent_token
            })
            data = response.json()
            state = data['state']
            return state
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        
    def send_action(self, action):
        try:
            response = requests.post(SERVER_API + '/action', json={
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
            response = requests.get(SERVER_API + '/method', json={
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
        