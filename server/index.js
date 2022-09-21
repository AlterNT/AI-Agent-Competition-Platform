import fs from 'fs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import API from './api.js'
import Database from './database.js'

async function main() {
    const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .command('load-test-data', 'Drops database and generates test data')
    .command('drop-db', 'Drops database')
    .command('tokens <file>', 'generates user tokens using student ids in file')
    .option('f', {
        alias: 'file',
        description: 'Load file',
        type: 'string',
    })
    .help()
    .argv

    await Database.init()
    API.init()

    if (argv._[0] == 'load-test-data') {
        await Database.loadTestData();
        process.exit(0);
    }

    if (argv._[0] == 'drop-db') {
        await Database.deleteAll();
        process.exit(0)
    }

    if (argv._[0] == 'tokens') {
        const tokens = await Database.generateUserTokens(argv.f);
        console.log('New Tokens Created:', tokens)
        process.exit(0)
    }
}

main()