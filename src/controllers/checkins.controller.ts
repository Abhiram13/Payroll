import express, { Request, Response } from "express";
import { MONGO as DB } from "../../index";
import { Collection, Document, ObjectId, Filter } from "mongodb";
import { tables } from "../services/globals";
import Controller from "./controller";

export class CheckInController<T extends Document> extends Controller<T> {
   constructor() {
      super();
      this.collection = tables?.checkins;      
   }
}