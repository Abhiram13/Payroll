import {ILoginRequest, ILoginResponse, ILoginRoleIdentifier, IMongo, IEncryptedToken} from "../types/login.types";
import { EmployeeController } from "./employee.controller";
import { IEmployeeSchema, IRoleSchema, RoleIdentifier } from "../types/schemas";
import Hashing from "../services/hashing";
import { RolesController } from "./roles.controller";
import { ObjectId } from "mongodb";

type EmployeeWithMongo = (IEmployeeSchema & IMongo);

export class LoginController {
   #payload: ILoginRequest;

   constructor (payload: ILoginRequest) {
      this.#payload = payload;
   }

   async #employeeList(): Promise<EmployeeWithMongo[] | null> {
      try {
         const controller = new EmployeeController<IEmployeeSchema & IMongo>();
         controller.aggregate = [
            { $match: { $and: [{ username: this.#payload?.user_name, password: this.#payload?.password }] } }
         ];

         const list: EmployeeWithMongo[] = await controller?.list();
         return list;
      } catch (e) {
         return null;
      }
   }

   async login(): Promise<ILoginResponse | null> {
      try {
         const list: EmployeeWithMongo[] | null = await this.#employeeList();

         if (list?.length) {
            let { _id, manager_id, organisation_id, role_id, username, first_name, last_name } = list[0];
            const roleController = new RolesController<IRoleSchema & IMongo>();

            roleController.aggregate = [
               { $match: { _id: new ObjectId(role_id) } },
               { $project: { identifier: 1 } },
               { $project: { _id: 0, name: 0 } }
            ];

            const result: ILoginRoleIdentifier[] = await roleController?.list();
            const identifier: RoleIdentifier | null = result?.length ? result[0]?.identifier : null;

            if (!identifier) {
               return null;
            }

            const payload: IEncryptedToken = { id: _id, managerId: manager_id, organisationId: organisation_id, roleId: role_id, roleIdentifier: identifier, userName: username, time: new Date().getTime() };
            const token = Hashing.encrypt<IEncryptedToken>(payload);

            return { name: `${first_name} ${last_name}`, token: token };
         }

         return null;
      } catch (e: any) {
         throw new Error(e?.message);         
      } 
   }
}