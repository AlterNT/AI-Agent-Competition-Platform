import AgentIO from './agent-io';
import ora from 'ora';
import { app, BrowserWindow } from 'electron';
import { helpMessage, loadingPromise, log, status } from './messages';

export class Client {

    /** @type {Client} */
    static instance;

    /** @type {AgentIO} */
    agentIO = new AgentIO();

    /** @type {Boolean} */
    isCLI = false;
    /** @type {String} */
    serverAddress = 'localhost';
    /** @type {Number} */
    port = 31415;
    /** @type {Agent} */
    agent;
    /** @type {String} */
    token = require('./config.json').token;
    /** @type {Number} */
    lobby = -1;
    /** @type {Number} */
    trials = 1;
    /** @type {Boolean} */
    tournamentMode = false;

    /**
     * Creates a new Client.
     */
    constructor() {
        Client.instance = this;
    }

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
            this.isCLI = true;
            // Help command.
            if (process.argv.some(a => a.match(/--help/i))) {
                helpMessage();
            } else {
                await this.cliRun();
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
    async cliRun() {
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
                    this.port = parseInt(flag.split('=')[1]);
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
                    this.lobby = parseInt(flag.split('=')[1]);
                    break;
                // Trials flag.
                case /--trials=\d+/i.test(flag):
                    this.trials = parseInt(flag.split('=')[1]);
                    break;
                // Tournament flag.
                case /--tournament/i.test(flag):
                    this.tournamentMode = true;
                    break;
                default:
                    break;
            }
        }

        status();
    }
}

(async () => {new Client().init()})();
