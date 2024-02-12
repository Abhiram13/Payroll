import { Mongo } from "./src/db";
import {router} from './src/routes/export.routes';
import {Logger, server} from "./src/services/export.services";

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