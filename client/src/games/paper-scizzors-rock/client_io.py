import sys
class ClientIO:
    # incoming messages from client
    def client_in(self):
        data = sys.stdin.readline().strip()
        if data.startswith('CLIENT-OUT: '):
            return data

    # outgoing messages to client
    def client_out(self, data):
        print(data)
        
