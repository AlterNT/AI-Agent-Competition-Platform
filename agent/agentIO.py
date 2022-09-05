import requests

class AgentIO:
    server_url = 'http://localhost:8080'

    def __init__(self, agentToken):
        self.agentToken = agentToken

    def server_path(self, path):
        return f'{self.server_url}/{path}'

    def join_lobby(self):
        response = requests.post(self.server_path('api/join'), json={ 'agentToken': self.agentToken, 'gameID': 'paper-scizzors-rock' })
        json = response.json()
        return json['success']

    def send_move(self):
        response = requests.post(self.server_path('api/action'), { 'agentToken': self.agentToken })

    def see(self):
        response = requests.get(self.server_path('api/state'), { 'agentToken': self.agentToken })
        json = response.json();
        return json['gamestate']

    def turn(self):
        response = requests.get(self.server_path('api/turn'), { 'agentToken': self.agentToken })
        json = response.json()
        return json['turn']
