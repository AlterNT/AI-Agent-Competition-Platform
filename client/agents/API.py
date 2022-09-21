import requests

class API:
    server_url = 'http://localhost:8080'

    def __init__(self, agentToken):
        self.agentToken = agentToken

    def server_path(self, path):
        return f'{self.server_url}/{path}'

    def join_lobby(self, lobbyID):
        try:
            response = requests.post(self.server_path('api/join'), json={
                'agentToken': self.agentToken,
                'lobbyID': lobbyID
            })
            response_json = response.json()
            return response_json['success']
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError

    def send_action(self, action):
        try:
            response = requests.post(self.server_path('api/action'), json={
                'agentToken': self.agentToken,
                'action': action
            })
            return response.json()
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
    
    def request_method(self, keys, method, params):
        try:
            response = requests.get(self.server_path('api/method'), json={
                'agentToken': self.agentToken,
                'keys': keys,
                'method': method,
                'params': params
            })
            return response.json()['data']
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
    
    def is_turn(self):
        try:
            response = requests.get(self.server_path('api/turn'), params={
                'agentToken': self.agentToken
            })
            return response.json().get('turn', False)
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
            

    

    
