from love_letter.agent_io import AgentIO

class Agent:
    def __init__(self, token, server):
        self.agentIO = AgentIO(token, server)
        self.token = token
        self.state = None
        
    def updateState(self):
        self.state = self.agentIO.getState()
    
    def move(self):
        move = None

        return move