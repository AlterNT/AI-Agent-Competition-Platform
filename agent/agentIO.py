import requests

headers = {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
}

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
            raise requests.exceptions.ConnectionError

    def send_action(self, action):
        try:
            response = requests.post(self.server_path('api/action'), json={
                'agentToken': self.agentToken,
                'action': action
            })
            return response
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
    
    def receive_method(self, method):
        try:
            response = requests.get(
                self.server_path('api/method'),
                json={
                    'agentToken': self.agentToken,
                    'method': method
                },
                headers=headers
            )
            return response
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError


    def see(self):
        return self.send_action('METHOD', 'see')

    def turn(self):
        try:
            response = requests.get(self.server_path('api/turn'), { 'agentToken': self.agentToken }, headers=headers)
            response_json = response.json()
            return response_json['turn']
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
