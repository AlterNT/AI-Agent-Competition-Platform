import json
import requests

class AgentIO:
    server_url = 'http://localhost:8080'

    def __init__(self, agentToken):
        self.agentToken = agentToken

    def server_path(self, path):
        return f'{self.server_url}/{path}'

    def join_lobby(self):
        response = requests.post(self.server_path('api/join'), json={ 'agentToken': self.agentToken, 'gameID': 'paper-scizzors-rock' })
        response_json = response.json()
        return response_json['success']

    def send_action(self, gameType, **kwargs):
        params = kwargs;
        params['type'] = gameType
        requests.post(self.server_path('api/action'), json={ 'agentToken': self.agentToken, 'action': {
            'name': 'ACTION',
            'action': json.dumps(params)
        }})

    def see(self):
        response = requests.get(self.server_path('api/state'), { 'agentToken': self.agentToken })
        response_json = response.json()
        return response_json['gamestate']

    def turn(self):
        response = requests.get(self.server_path('api/turn'), { 'agentToken': self.agentToken })
        response_json = response.json()
        return response_json['turn']
