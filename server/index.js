import dotenv from 'dotenv';
import 'dotenv/config'
import Server from './server.js';
import runAPI from "./api.js";
import process from 'process';

const help = () => {
    console.log(
        `USAGE:
        To generate Tokens: node server tokens [studentIdFilePath]
        To run a tournament: node server run-tournament
        `
    );
}

const server = new Server();

switch (process.argv[2]) {
    case 'tokens':
        const tokenFile = process.argv.length >= 3 && process.argv[3];
        if (tokenFile) {
            const tokens = server.generateUserTokens(tokenFile);
            console.log(tokens);
        } else {
            help();
        }
        break;
    case 'start':
        await runAPI(server);
        break;
    default:
        help();
        break;
}
