import {ILoginRequest, ILoginResponse, ILoginRoleIdentifier, IMongo, IEncryptedToken} from "../types/login.types";
import { EmployeeController } from "./employee.controller";
import { IEmployeeSchema, IRoleSchema, RoleIdentifier } from "../types/schemas";
import Hashing from "../services/hashing";
import { RolesController } from "./roles.controller";
import { ObjectId } from "mongodb";

type EmployeeWithMongo = (IEmployeeSchema & IMongo);
type IdentifierValue = {identifier: number};

export class LoginController {
   #payload: ILoginRequest;

   constructor (payload: ILoginRequest) {
      this.#payload = payload;
   }

   /**
    * fetches employee with given User name and Password
    * @returns Employee details if exist
    * @returns null if Employee does not exists
    */
   async #employeeList(): Promise<EmployeeWithMongo[] | null> {
      try {
         const controller = new EmployeeController();
         controller.aggregate = [
            { $match: { $and: [{ username: this.#payload?.user_name, password: this.#payload?.password }] } }
         ];

         const list: EmployeeWithMongo[] = await controller?.list() as EmployeeWithMongo[];
         return list;
      } catch (e) {
         return null;
      }
   }

   async login(): Promise<ILoginResponse | null> {
      try {
         const list: EmployeeWithMongo[] | null = await this.#employeeList();

         if (list?.length) {
            const { _id: employee_id, manager_id, organisation_id, role_id, username, first_name, last_name } = list[0];
            const roleController = new RolesController();
            const result: IdentifierValue | null = await roleController?.findById(role_id, {identifier: 1}, {_id: 0, name: 0});
            const identifier: RoleIdentifier | null = result?.identifier || null;

            if (!identifier) {
               return null;
            }

            const payload: IEncryptedToken = { 
               id: employee_id,
               managerId: manager_id, 
               organisationId: organisation_id, 
               roleId: role_id, 
               roleIdentifier: identifier,
               userName: username, 
               time: new Date().getTime() 
            };

            const token = Hashing.encrypt<IEncryptedToken>(payload);

            return { name: `${first_name} ${last_name}`, token: token };
         }

         return null;
      } catch (e: any) {
         throw new Error(e?.message);         
      } 
   }
}