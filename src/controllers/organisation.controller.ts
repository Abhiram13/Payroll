import { tables } from "../services/globals";
import Controller from "./controller";
import { IOrganisationSchema } from "../types/schemas";

export class OrganisationController extends Controller<IOrganisationSchema> {
   constructor() {
      super();
      this.collection = tables?.organisation;      
   }
}