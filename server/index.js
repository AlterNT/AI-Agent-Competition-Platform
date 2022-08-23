import dotenv from 'dotenv';
import 'dotenv/config'
import Server from './Server.js';
import runAPI from "./api.js";
import process from 'process';

dotenv.config();

const server = new Server();
await runAPI(server);
