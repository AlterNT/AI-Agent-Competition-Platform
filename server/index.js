import 'dotenv/config'
import Server from './server.js';
import API from "./api.js";
import process from 'process';

const help = () => {
    console.log(
        `USAGE (from /server):
        Run server: node .
        Help string: node . help
        Drop then generate test data: node . load-test-data
        Drop db: node . drop-db
        Generate Tokens: node . tokens [studentIdFilePath]
        `
    );
}

const server = new Server();
await server.init();

switch (process.argv[2]) {
    case 'tokens':
        const tokenFile = process.argv.length >= 3 && process.argv[3];
        if (tokenFile) {
            const tokens = await server.generateUserTokens(tokenFile);
            console.log(tokens);
            process.exit(0);
        } else {
            help();
            process.exit(1);
        }

    case 'drop-db':
        await server.deleteAll();
        process.exit(0);

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

    case 'init':
        process.exit(0);

    case 'load-test-data':
        console.log('Loading test data')
        await server.loadTestData();
        process.exit(0);

    default:
        break;
}
