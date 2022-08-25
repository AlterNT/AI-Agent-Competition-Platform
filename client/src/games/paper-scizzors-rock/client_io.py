class ClientIO:
    def agent_out(self, data):
        print('CLIENT-IO: ' + data)

    def agent_in(self, data):
        if data.startswith('AGENT-IO: '):
            print(data)
