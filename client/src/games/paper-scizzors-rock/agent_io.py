import sys

class AgentIO:
    # incoming messages from client
    def agent_in(self):
        data = sys.stdin.readline().strip()
        if data.startswith('CLIENT-OUT: '):
            return data

    # outgoing messages to client
    def agent_out(self, data):
        print(data)
        
    
        
