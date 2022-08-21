import('node-fetch')

const SERVER_API_ENDPOINT = 'http://localhost:8080/api'
export default class ServerHandler {

    async connect() {
        let addr = `${Client.instance.serverAddress}:${Client.instance.port}`;
        log(`Connecting to ${addr}!`);
        let res;
        try {
            //res = await fetch(`http://${addr}/api/joinLobby?user=${Client.instance.token}&lobby=${Client.instance.lobby}`);
            res = {ok:true,text:()=>'1'};
        } catch (err) {
            error(`Failed to connect to ${addr}!`);
            if (Client.instance.isCLI) process.exit(1);
        }

        if (res.ok) {
            Client.instance.lobby = parseInt(await res.text());
            log(`Connected to server! Assigned to lobby ${Client.instance.lobby}.`);
        } else {
            error(`Failed to connect to lobby ${Client.instance.lobby}!`);
            if (Client.instance.isCLI) process.exit(1);
        }
    }

    async lobbyWait() {
        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) process.stdin.setRawMode(true);

        process.stdin.on('keypress', (str, key) => {
            if(key.ctrl == true && key.name == 'c'){
                process.exit()
            }
            console.log(str);
            console.log(key);
        })

        while (true) {
            
        }

        setInterval()
        log(`Lobby Status:`);
    }

}