import { app, BrowserWindow } from 'electron';
import colors from 'colors/safe';

class Client {

    /** @type {Boolean} */
    CLIMode = false;
    /** @type {String} */
    serverAddress = 'localhost';
    /** @type {Number} */
    port = 31415;
    /** @type {Agent} */
    agent;
    /** @type {String} */
    token = require('./config.json').token;
    /** @type {Number} */
    lobby = 0;
    /** @type {Number} */
    trials = 1;
    /** @type {Boolean} */
    tournamentMode = false;

    /** @type {String} */
    static #HELPTEXT = `${colors.yellow.underline('Usage:')}
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
    `;

    /**
     * Initializes the application.
     */
    async init() {
        await app.whenReady();

        // Fix for running uncompiled app.
        if (app.isPackaged) {
            process.argv.splice(0, 1);
        } else {
            process.argv.splice(0, 2);
        }

        // If --cli flag provided, run in CLI mode.
        if (process.argv.some(a => a.match(/--cli/i))) {
            // Help command.
            if (process.argv.some(a => a.match(/--help/i))) {
                console.log(Client.#HELPTEXT);
            } else {
                this.cliRun();
            }
            process.exit();
        }

        this.createWindow();
        this.registerWindowEvents();
    }

    /**
     * Registers all window events.
     */
    registerWindowEvents() {
        // Exit the client if all windows are closed, except for MacOS.
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') app.quit();
        });
        // Open a new window if none are open, but the client is running.
        // Relevent for MacOS.
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
    }

    /**
     * Creates the window and loads the interface.
     */
    createWindow() {
        const window = new BrowserWindow({
            width: 800,
            height: 600,
        });

        window.loadFile('src/index.html');
    }

    /**
     * Executes the application in CLI.
     */
    cliRun() {
        // Parse flags.
        for (const flag of process.argv) {
            let value;
            switch (true) {
                // Server flag.
                case /--server=.+/i.test(flag):
                    value = flag.split('=')[1];
                    [this.serverAddress, this.port = this.port] = flag.split(':');
                    break;
                // Port flag.
                case /--port=\d+/.test(flag):
                    this.port = flag.split('=')[1];
                    break;
                // Agent flag.
                case /--agent=.+/i.test(flag):
                    value = flag.split('=')[1];
                    // Trim quotation marks from command.
                    this.agent = value.slice(1, -1);
                    break;
                // Test mode flag.
                case /--test|-t/i.test(flag):
                    this.token = 'TEST';
                // Lobby flag.
                case /--lobby=\d+/i.test(flag):
                    this.lobby = flag.split('=')[1];
                    break;
                // Trials flag.
                case /--trials=\d+/i.test(flag):
                    this.trials = flag.split('=')[1];
                    break;
                // Tournament flag.
                case /--tournament/i.test(flag):
                    this.tournamentMode = true;
                    break;
                default:
                    break;
            }
        }
    }
}

new Client().init();
