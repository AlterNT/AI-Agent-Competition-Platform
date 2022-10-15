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

/** @type {{tournamentMode: Boolean, database: {enabled: Boolean, protocol: String, host: String, port: Number, username: String, password},games: Object.<String, {path: String, settings: {maxPlayers: Number, minPlayers: Number, timeout: Number, failClause: String, bot: String}, tournament: {}}>}} */
let config = readConfig('config.json5')

if (!config) {
    console.error('`config.json5` not found, defaulting to `config.json5.example`')
    config = readConfig('config.json5.example')
    console.log(config)
}

export default config;
