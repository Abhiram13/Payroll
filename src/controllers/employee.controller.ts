import express, { Request, Response } from "express";
import { MONGO as DB } from "../../index";
import { Collection, Document, ObjectId, Filter } from "mongodb";
import { tables } from "../services/globals";

class Controller {
   collection: string;
   body: any;

   constructor() {
      this.collection = "";
      this.body = {};
   }

   async insert(): Promise<string> {
      const collection: Collection = DB.client.db(process.env.DB).collection(this.collection);
      const document = collection.insertOne(this.body);
      const { acknowledged } = await document;
      const message: string = acknowledged ? "Document inserted successfully" : "Inserting document failed";

      return message
   }
}

export class EmployeeController extends Controller {
   constructor(body: any) {
      super();
      this.collection = tables?.employee;
      this.body = body;
   }
}