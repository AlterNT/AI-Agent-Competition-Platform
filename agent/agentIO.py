import requests

class AgentIO:
    server_url = 'http://localhost:8080'

    def __init__(self, agentToken):
        self.agentToken = agentToken

    def server_path(self, path):
        return f'{self.server_url}/{path}'

    def join_lobby(self):
        try:
            response = requests.post(self.server_path('api/join'), json={
                'agentToken': self.agentToken,
                'gameID': 'paper-scissors-rock'
            })
            response_json = response.json()
            return response_json['success']
        except requests.exceptions.ConnectionError:
            return False

    def send_action(self, type, value):
        try:
            response = requests.post(self.server_path('api/action'), json={
                'agentToken': self.agentToken,
                'action': {
                    'type': type,
                    'value': value
                }
            })
            return response
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError

    def see(self):
        return self.send_action('METHOD', 'see') # ['gamestate']

    def turn(self):
        try:
            response = requests.get(self.server_path('api/turn'), { 'agentToken': self.agentToken })
            response_json = response.json()
            return response_json['turn']
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
