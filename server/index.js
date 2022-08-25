import API from './api.js'
import LobbyManager from './lobby-manager.js'

async function main() {
    // intialise API
    const api = new API()
    api.run()
}

main()