import { cosmiconfigSync } from 'cosmiconfig';
import JSON5 from 'json5';

/** @type {{database: {enabled: Boolean, protocol: String, host: String, port: Number, username: String, password},games: Object.<String, {path: String, settings: {maxPlayers: Number, minPlayers: Number, timeout: Number, failClause: String, bot: String}, tournament: {}}>}} */
export default cosmiconfigSync('config', {
    searchPlaces: [
        'config.json5'
    ],
    loaders: {
        '.json5': (_, data) => JSON5.parse(data),
    }
}).search().config;
