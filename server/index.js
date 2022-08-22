import Neode from 'neode';
import Models from './models/index.js';
import LobbyManager from './lobby-manager.js';
import Game from './game/game.js';
import PaperScissorsRock from './game/psr.js';

export default class Server {

    /** @type {Server} */
    static instance;

    /** @type {Neode} */
    //db_instance = Neode.fromEnv().with(Models);
    /** @type {LobbyManager} */
    lobbyManager;

    /** @type {[String]} */
    games;

    /** @type {typeof Game}} */
    Game = PaperScissorsRock;

    async handleClose() {
    }

    async run() {
        console.log(this.Game.maxPlayers);
    }
}

const server = new Server();
await server.run();
process.exit(0);