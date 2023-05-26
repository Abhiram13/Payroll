import { MongoClient } from "mongodb";
require('dotenv').config();

export class Mongo {
   private static URI: string = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}/?retryWrites=true&w=majority`;
   static client: MongoClient = new MongoClient(Mongo.URI);
   static async Connect(): Promise<void> {
      try {
         await Mongo.client.connect();
         Mongo.client.db(process.env.DB);
      } catch (e: any) {
         console.log('ENV IS: ', process?.env);
         console.error(e?.message);
      }
   }
}