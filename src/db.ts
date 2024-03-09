import { MongoClient, Db } from "./types/export.types";
import { Logger } from "./services/export.services";

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
      } catch (e: any) {
         Logger.error(e, 'At Mongo');
         Logger.warn('Closing the DB connection');
         this.close();
      }
   }

   db(): Db {
      return this.#client.db(process.env.DB);
   }

   close() {
      this.#client.close();
   }
}

export const Mongo = new MongoDB();