import express, { Request, Response } from "express";
import { MONGO as DB } from "../../index";
import { Collection, Document, ObjectId, Filter } from "mongodb";
import { tables } from "../services/globals";
import Controller from "./controller";

export class EmployeeController<T extends Document> extends Controller<T> {
   constructor(body: T) {
      super();
      this.collection = tables?.employee;
      this.body = body;
   }
}