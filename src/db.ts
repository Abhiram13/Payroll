import { MongoClient, Db } from "./types/export.types";
import {Logger} from "./services/logger.service";
require('dotenv').config();

class MongoDB {
   #url: string;
   #client: MongoClient;

   constructor() {
      this.#url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}/?retryWrites=true&w=majority`;
      this.#client = new MongoClient(this.#url);
   }

   async connect(): Promise<void> {
      try {
         await this.#client.connect();
      } catch (e: any) {}
   }

   db(): Db {
      return this.#client.db(process.env.DB);
   }

   close() {
      this.#client.close();
   }
}

export const Mongo = new MongoDB();