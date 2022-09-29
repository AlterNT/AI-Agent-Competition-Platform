import 'process';
import fs from 'fs';
import Neode from 'neode';


import Models from './models/index.js';
import TokenGenerator from './token-generator.js';
import API from './api.js';
import LobbyManager from './lobby-manager.js';
import DBSync from './db-sync.js';
import 'process';
import Database from './database.js';
import Config from './config.js';

export default class Server {
    /** @type {Server} */
    static instance;

    constructor() {
        if (Server.instance) {
            return Server.instance;
        }

        Server.instance = this;
    }

    async init() {
        API.init();
    }

}
