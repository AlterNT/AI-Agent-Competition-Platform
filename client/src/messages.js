import colors from 'colors/safe';
import ora from 'ora';
import { Client } from './main';

/**
 * Prints the help message to stdout.
 */
export const helpMessage = () => console.log(`${colors.yellow.underline('Usage:')}
client ${colors.blue('[options]')}

${colors.yellow.underline('Options:')}
${colors.green('--server=')}${colors.blue('SERVER')}
    Specifies the server address to connect to.
    Defaults to 'localhost'
    ${colors.blue('SERVER')} must specify a valid IP address.
    Optionally, a port can also be provided, separated with ':'.
${colors.green('--port=')}${colors.blue('PORT')}
    Specifies the port to connect to the server with.
    Defaults to ''
    ${colors.blue('PORT')} must be a valid port number.
${colors.green('--agent=\"')}${colors.blue('AGENT')}${colors.green('\"')}
    The launch command for your agent.
    ${colors.blue('AGENT')} must be enclosed in quotation marks.
${colors.green('--test')} | ${colors.green('-t')}
    Indicates this as a testing run to the server to prevent
    history logging.
${colors.green('--lobby=')}${colors.blue('LOBBY')}
    Specifies a lobby to attempt to join.
    If this lobby does not exist,
    one will be created with this number.
    ${colors.blue('LOBBY')} must be an integer.
    This is mutually-exclusive with ${colors.green('--tournament')}.
${colors.green('--trials=')}${colors.blue('TRIALS')}
    If a new lobby is to be created,
    this is the number of trials the lobby is set to.
${colors.green('--tournament')}
    Attempts to join a tournament if one is running.
    This is mutually-exclusive with ${colors.green('--lobby')}.
`);

const logErrorText = (message, err) =>`${colors.yellow('[Client]')} ${colors.red('Error: ' + message)}

${colors.yellow('[Client]')} Error Message:

${err}
`;

/**
 * Sends a error message to stderr with a description.
 * @param {String} message Client error message.
 * @param {String} err Agent error message.
 */
export const logError = (message, err) => console.error(logErrorText(message, err));

const errorText = message => `${colors.yellow('[Client]')} ${colors.red('Error: ' + message)}`;

/**
 * Sends an error message to sterr.
 * @param {String} message Error message.
 */
export const error = message => console.error(errorText(message));

/**
 * Logs all input parameters for execution.
 */
export const status = () => {
    let msg = `${colors.yellow('[Client]')} Running agent with:
    ${colors.green('server:')}\t${Client.instance.serverAddress}:${Client.instance.port}
    ${colors.green('agent:')}\t${Client.instance.agent}`;
    if (Client.instance.tournamentMode) {
        msg += `\n    ${colors.green('tournament-mode:')}\ttrue\n`;
    } else {
        msg += `\n    ${colors.green('lobby:')}\t`
        if (Client.instance.lobby === -1) {
            msg += 'Automatic';
        } else {
            msg += Client.instance.lobby;
        }
        msg += `\n    ${colors.green('trials:')}\t${Client.instance.trials}\n`;
    }
    console.log(msg);
};

/**
 * Logs text to the console with a '[Client] ' prefix.
 * @param {*} msg Message to log.
 */
export const log = msg => console.log(`${colors.yellow('[Client]')} ${msg}`);

/**
 * Prints a loading spinner to stdout while a promise is being fufilled.
 * @param {Promise} action Promise to execute.
 * @param {String} text Text to show while loading.
 * @param {*} successText Text to show on success.
 * @param {*} failText Text to show on failiure.
 * @returns {Promise} the promise executed.
 */
export const loadingPromise = async (action, text, successText, failText) => ora.promise(action, {
    prefixText: colors.yellow('[Client]'),
    text: text,
    successText: successText,
    failText: err => logErrorText(failText, err)
});