import express from "express";
import http from "http";
import { Application } from "express";
import { Mongo } from "./src/db";
import router from './src/routes/routes';
import Logger from "./src/services/logger.service";
import cors from 'cors';
import path from 'path';
import * as fs from 'fs';
import cluster from 'cluster';
import os from 'os';

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
   var filePath = path?.join(__dirname, '../../../Downloads/videoplayback.mp4');
   var stat = fs?.statSync(filePath);

   console.log(req?.headers?.range);

   res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size
   });

   var readStream = fs?.createReadStream(filePath);
   readStream.pipe(res);
})

export { app, server };

function StartServer(): void {
   Mongo.Connect();
   Logger.info(`TypeScript started on port ${port}!`);
}

// const formatMemoryUsage = (data: number) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
// const memoryData = process?.memoryUsage();

// const memoryUsage = {
//    rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
//    heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
//    heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
//    external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
//    array: `${formatMemoryUsage(memoryData.arrayBuffers)} -> Array buffers memory`,
// };

if (process?.env?.NODE_ENV !== 'test') {
   server = app.listen(port, StartServer);

   // if API response not sent during this time, server will throw timeout error
   server.timeout = 20 * seconds;
};

// if (cluster?.isPrimary) {
//    const cpus = os?.cpus()?.length;

//    Logger.log({cpus});

//    for (var i = 0; i < cpus; i++) {
//       cluster?.fork();
//    }

//    cluster?.on('exit', (w, c, s) => {
//       console.log(`worker ${w?.process?.pid} is DEAD!!!! 💀`);
//    });
// } else {
//    Logger?.info(`Process started with Id: ${process?.pid}`);
//    if (process?.env?.NODE_ENV !== 'test') {
//       server = app.listen(port, StartServer);

//       // if API response not sent during this time, server will throw timeout error
//       server.timeout = 20 * seconds;
//    };
// };

process.on('unhandledRejection', () => {
   Logger?.info("unhandledRejection");
})