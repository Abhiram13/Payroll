import { tables } from "../services/globals";
import Controller from "./controller";
import { IRoleSchema } from "../types/schemas";
import { IRoleIdentifier } from "../types/login.types";

export class RolesController extends Controller<IRoleSchema> {
   constructor() {
      super();
      this.collection = tables?.roles;      
   }

   async fetchRoleIdentifierByEmpRoleId(roleId: string): Promise<IRoleIdentifier | null> {
      try {
         const res: IRoleIdentifier | null = await this.findById(roleId, {identifier: 1}, {_id: 0});
         return res;
      } catch(e: any) {
         return null;
      }
   }
}