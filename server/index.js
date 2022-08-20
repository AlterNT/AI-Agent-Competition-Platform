import Neode from 'neode';
import Models from './models/index.js';
import 'process';

class Server {
    constructor() {
        this.db_instance = Neode.fromEnv().with(Models);
    }

    async handleClose() {
    }

    async run() {
    }
}

const server = new Server();
await server.run();
process.exit(0);
