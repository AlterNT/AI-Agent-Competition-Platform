import API from './api.js'
import LobbyManager from './lobby-manager.js'

async function main() {
    // initialise Lobby Manager
    const lobbyManager = new LobbyManager()

    // intialise API
    const api = new API()
    api.run()


    
}

main()