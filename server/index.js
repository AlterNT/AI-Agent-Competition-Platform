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
    case 'load-test-data':
        await server.loadTestData();
        process.exit(0);

    case 'showTopPerformer':
        await server.showTopPerformer();
        process.exit(0);
    
    case 'showMostImproved':
        await server.showMostImproved();
        process.exit(0);

    case 'showAgentGames':
        await server.showAgentGames();
        process.exit(0);

    case 'showAgentWinrate':
        await server.showAgentWinrate();
        process.exit(0);
    
    case 'showAgentRecentGames':
        await server.showAgentRecentGames();
        process.exit(0);
    
    case 'showUserAgents':
        await server.showUserAgents();
        process.exit(0);

    case 'showBotAgents':
        await server.showBotAgents();
        process.exit(0);

    default:
        help();
        process.exit(1)
}
