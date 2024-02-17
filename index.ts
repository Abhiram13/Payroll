import { Mongo } from "./src/db";
import {router} from './src/routes/export.routes';
import {Logger, server} from "./src/services/export.services";

require('dotenv').config();

export var MONGO = Mongo;
const serverPort = process.env.PORT || 3000;
const testPort = process.env.TEST_PORT;
const port = process.env.NODE_ENV !== 'test' ? serverPort : testPort;

function StartServer(): void {
   Mongo.Connect();
   Logger.info(`TypeScript started on port ${port}!`);
}


server.listen(Number(port), StartServer);
server.use({ path: '', router: router });

export {server};