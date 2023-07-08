import { Document } from "mongodb";
import { tables } from "../services/globals";
import Controller from "./controller";

export class LeaveController<T extends Document> extends Controller<T> {
   constructor() {
      super();
      this.collection = tables?.leaves;      
   }
}