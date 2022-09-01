import 'dotenv/config'
import Server from './server.js';
import runAPI from "./api.js";
import process from 'process';

const help = () => {
    console.log(
        `USAGE (from /server):
        To get help string: node . help
        To generate Tokens: node . tokens [studentIdFilePath]
        To run a tournament: node . run-tournament
        To test initializing: node . init
        To generate test data: node . load-test-data
        `
    );
}

const server = new Server();
await server.init();

switch (process.argv[2]) {
    case 'tokens':
        const tokenFile = process.argv.length >= 3 && process.argv[3];
        if (tokenFile) {
            const tokens = server.generateUserTokens(tokenFile);
            console.log(tokens);
            process.exit(0);
        } else {
            help();
            process.exit(1);
        }

    case 'start':
        await runAPI(server);
        break;

    case 'init':
        process.exit(0);

    case 'load-test-data':
        await server.loadTestData();
        process.exit(0);

    case 'showTopPerformer':
        await server.showTopPerformer();
        process.exit(0);

    case 'showMostImproved':
        await server.showMostImproved();
        process.exit(0);

    case 'help':
        help();
        process.exit(0)

    default:
        help();
        process.exit(1)
}
