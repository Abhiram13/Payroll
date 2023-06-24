import { tables } from "../services/globals";
import Controller from "./controller";
import { IRoleSchema } from "../types/schemas";
import { RoleIdentifier } from "../types/schemas";

export class RolesController extends Controller<IRoleSchema> {
   constructor() {
      super();
      this.collection = tables?.roles;      
   }

   async fetchRoleIdentifierByEmpRoleId(roleId: string): Promise<{identifier: RoleIdentifier} | null> {
      try {
         const res: {identifier: RoleIdentifier} | null = await this.findById(roleId, {identifier: 1}, {_id: 0});
         return res;
      } catch(e: any) {
         return null;
      }
   }
}