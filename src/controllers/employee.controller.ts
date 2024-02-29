import { tables } from "../services/globals";
import Controller from "./controller";
import { IEmployeeSchema } from "../types/schemas";

type RoleId = {role_id: string};

export class EmployeeController extends Controller<IEmployeeSchema> {
   constructor() {
      super(tables?.employee);
   }

   async fetchEmployeeByAdminId(adminId: string): Promise<RoleId | null> {
      try {
         const result: RoleId | null = await this?.findById(adminId, {role_id: 1}, {_id: 0});
         return result;
      } catch (e: any) {
         return null;
      }
   }
}