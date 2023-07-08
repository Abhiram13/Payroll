import { Mongo } from "./src/db";
import router from './src/routes/routes';
import Logger from "./src/services/logger.service";
import {server} from "./src/services/server";

require('dotenv').config();

export var MONGO = Mongo;
const port = process.env.PORT || 3000;

function StartServer(): void {
   Mongo.Connect();
   Logger.info(`TypeScript started on port ${port}!`);
}

if (process?.env?.NODE_ENV !== 'test') {
   server.listen(Number(port), StartServer);

   server.use({path: '', router: router});   
};

export {server};