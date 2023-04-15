import express, { Request, Response } from "express";
import { MONGO as DB } from "../../index";
import { Collection, Document, Filter, UpdateFilter } from "mongodb";
import {ObjectId} from "bson";
import { StatusCodes } from "../types/login.types";

export default class Controller<T extends Document> {
   collection: string;
   body: T;
   aggregate?: Document[];

   constructor() {
      this.collection = "";
      this.body = {} as T;
      this.aggregate = [];
   }

   async insert(): Promise<StatusCodes> {
      const collection: Collection = DB.client.db(process.env.DB).collection(this.collection);
      const document = collection.insertOne(this.body);
      const { acknowledged } = await document;
      const status: StatusCodes = acknowledged ? StatusCodes?.OK : StatusCodes?.NOT_MODIFIED

      return status;
   };

   async update(filter: Filter<Document> = {}, set: UpdateFilter<T>): Promise<StatusCodes> {
      const collection: Collection = DB.client.db(process.env.DB).collection(this.collection);
      const document = collection.updateOne(filter, set)
      const { acknowledged } = await document;
      const status: StatusCodes = acknowledged ? StatusCodes?.OK : StatusCodes?.NOT_MODIFIED

      return status;
   };

   async list(): Promise<T[]> {
      const collection: Collection<T> = DB.client.db(process.env.DB).collection<T>(this.collection);
      const data = await collection.aggregate<T>(this.aggregate).toArray();

      return data;
   };

   async findById(id: string): Promise<T | null> {
      const collection: Collection<T> = DB.client.db(process.env.DB).collection<T>(this.collection);
      const data = await collection.aggregate<T>([{$match: {_id: new ObjectId(id)}}]).toArray();

      return data?.length ? data[0] : null;
   };
}