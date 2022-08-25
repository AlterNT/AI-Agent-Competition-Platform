class ClientIO:
    def agent_out(data):
        print('CLIENT-IO: ' + data)

    def agent_in(data):
        if data.startswith('AGENT-IO: '):
            print(data)
