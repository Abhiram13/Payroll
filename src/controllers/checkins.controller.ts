import { Document } from "mongodb";
import { tables } from "../services/globals";
import Controller from "./controller";

export class CheckInController<T extends Document> extends Controller<T> {
   constructor() {
      super(tables?.checkins);
   }
}