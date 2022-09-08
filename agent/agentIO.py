import time
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
    
    def request_method(self, keys, method, params):
        try:
            response = requests.get(self.server_path('api/method'), json={
                'agentToken': self.agentToken,
                'keys': keys,
                'method': method,
                'params': params
            })
            return response
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError

    def game_finished(self):
        try:
            finished_json = self.request_method([], 'finished', []).json()
            return not finished_json or finished_json['data']['finished']
        except requests.exceptions.ConnectionError:
            return True

    def see(self):
        return self.request_method([], 'see', []).json()

    def await_game_start(self):
        try:
            print('awaiting game start...')
            while True:
                data = self.see()['data']
                error = data.get('error')
                if not error:
                    break
                time.sleep(1)
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
        print('game started')

    def turn(self):
        try:
            response = requests.get(self.server_path('api/turn'), { 'agentToken': self.agentToken }, headers=headers)
            response_json = response.json()
            return response_json['turn']
        except requests.exceptions.ConnectionError:
            raise requests.exceptions.ConnectionError
