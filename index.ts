import express from "express";
import http from "http";
import { Application } from "express";
import { Mongo } from "./src/db";
import router from './src/routes/routes';
import Logger from "./src/services/logger.service";
import cors from 'cors';
import path from 'path';
import {statSync, createReadStream} from 'fs';

require('dotenv').config();

export var MONGO = Mongo;
const app: Application = express();
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const seconds = 1000;
let server: http.Server;

app.use(cors({
   origin: ['http://localhost:3000', 'http://localhost:3002'],
   optionsSuccessStatus: 200,
}));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/", router);

app.get("/video", (req, res) => {
   const filePath = path?.join(__dirname, '../../../Downloads/videoplayback.mp4');
   const stat = statSync(filePath);

   console.log(req?.headers?.range);

   res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size
   });

   const readStream = createReadStream(filePath);
   readStream.pipe(res);
});

export { app, server };

function StartServer(): void {
   Mongo.Connect();
   Logger.info(`TypeScript started on port ${port}!`);
}

if (process?.env?.NODE_ENV !== 'test') {
   server = app.listen(port, StartServer);

   // if API response not sent during this time, server will throw timeout error
   server.timeout = 20 * seconds;
};

process.on('unhandledRejection', () => {
   Logger?.info("unhandledRejection");
})