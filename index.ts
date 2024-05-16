// require('dotenv').config();

import { Mongo } from "./src/db";
import {router} from './src/routes/export.router';
import {Logger, server} from "./src/services/export.services";

export var MONGO = Mongo;

const serverPort = process.env.PORT || 3000;
const testPort = process.env.TEST_PORT;
const port = process.env.NODE_ENV !== 'test' ? serverPort : testPort;

function StartServer(): void {
   // Mongo.connect();
   // Logger.info(`TypeScript started on port ${port}!`);
   console.log(`TypeScript started on port ${port}!`);
}

server.listen(Number(port), StartServer);
server.use({ path: '', router: router });

// process.stdin.resume();

// process.on('SIGINT', signal => {
//    Logger.warn('Closing server and it`s connections..');
//    Mongo.close();
//    server.close();

//    // Exiting with code 0, due to "Error: write EIO"
//    process.exit(0);
// });

export {server};