import express, { Response, Request, NextFunction, response } from "express";
import http from "http";
import {Application} from "express";
import { Mongo } from "./src/db";
import router from './src/routes/routes';
import Logger from "./src/services/logger.service";
import cors from 'cors';

require('dotenv').config();

export var MONGO = Mongo;
const app: Application = express();
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const seconds = 1000;
let server: http.Server;

if (process?.env?.NODE_ENV !== 'test') {
   server = app.listen(port, StartServer);
   
   // if API response not sent during this time, server will throw timeout error
   server.timeout = 20 * seconds;
}

app.use(cors({
   origin: ['http://localhost:3000', 'http://localhost:3002'],
   optionsSuccessStatus: 200,
}));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use("/", router);

export {app, server};

function StartServer(): void {
   Mongo.Connect();
   Logger.info(`TypeScript started on port ${port}!`);   
}
