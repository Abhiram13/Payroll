import express, { Response, Request, NextFunction, response } from "express";
import http from "http";
import {Application} from "express";
import { Mongo } from "./src/db";
import router from './src/routes/routes';
import Logger from "./src/services/logger.service";

require('dotenv').config();

export var MONGO = Mongo;
const app: Application = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const seconds = 1000;
export const server: http.Server = app.listen(port, StartServer);

app.use(cors());
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use("/", router);

export {app};

function StartServer(): void {
   Mongo.Connect();
   Logger.info(`TypeScript started on port ${port}!`);   
}

// if API response not sent during this time, server will throw timeout error
server.timeout = 20 * seconds;