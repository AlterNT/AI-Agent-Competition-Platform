import 'dotenv/config'
import Server from './server.js';
import runAPI from "./api.js";
import process from 'process';

const help = () => {
    console.log(
        `USAGE (from /server):
        To get help string: node . help
        To generate test data: node . load-test-data
        To run a database query: node . run-db-query queryName
        To generate Tokens: node . tokens [studentIdFilePath]
        To test server initialization: node . init
        TODO: To run a tournament: node . run-tournament
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
        break;
    case 'run-db-query':
        const queryName = process.argv.length >= 3 && process.argv[3];
        if (queryName) {
            try {
                // TODO get query list from server after game-statistics-api is merged
                const query = server[queryName].bind(server);
                if (!query) {
                    console.error(`Query ${queryName} does not exist, is there a typo?`);
                    process.exit(1);
                }

                const result = await query();
                console.log(result);
                process.exit(0);
            } catch (e) {
                console.error(`Query ${queryName} has failed: ${e}`);
                process.exit(1);
            }
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

    default:
        help();
        process.exit(1)
}
