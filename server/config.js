import { cosmiconfigSync } from 'cosmiconfig';
import JSON5 from 'json5';

const readConfig = (searchPath) => {
    return cosmiconfigSync('config', {
        searchPlaces: [
            searchPath
        ],
        loaders: {
            '.json5': (_, data) => JSON5.parse(data),
            '.example': (_, data) => JSON5.parse(data),
        }
    }).search()?.config;
}

/** @type {{tournamentMode: Boolean, database: {enabled: Boolean, protocol: String, host: String, port: Number, username: String, password},games: Object.<String, {path: String, settings: {maxPlayers: Number, minPlayers: Number, autoLogging: Boolean, loggingEnabled: Boolean, failClause: String, bot: String}}>}} */
let path = 'config.json5';
let config = readConfig(path)

// This is an extra safety measure to ensure that the tests can't be run
// on the actual database since that would wipe all the data
if (process.env.NODE_ENV == "test") config.database.database = "test";


if (!config) {
    console.error('`config.json5` not found, defaulting to `config.json5.example`')
    config = readConfig('config.json5.example')
    console.log(config)
}

export default config;
