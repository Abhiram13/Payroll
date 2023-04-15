import {ILoginRequest, ILoginResponse, ILoginRoleIdentifier, IMongo, IEncryptedToken} from "../types/login.types";
import { EmployeeController } from "./employee.controller";
import { IEmployeeSchema, IRoleSchema, RoleIdentifier } from "../types/schemas";
import Hashing from "../services/hashing";
import { RolesController } from "./roles.controller";
import { ObjectId } from "mongodb";

export class LoginController {
   async login(payload: ILoginRequest): Promise<ILoginResponse | null> {
      try {
         const controller = new EmployeeController<IEmployeeSchema & IMongo>();
         controller.aggregate = [
            { $match: { $and: [{ username: payload?.user_name, password: payload?.password }] } }
         ];

         const list: (IEmployeeSchema & IMongo)[] = await controller?.list();

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

            const payload: IEncryptedToken = { id: _id, managerId: manager_id, organisationId: organisation_id, roleId: role_id, roleIdentifier: identifier, userName: username };
            const token = Hashing.encrypt<IEncryptedToken>(payload);

            return { name: `${first_name} ${last_name}`, token: token };
         }

         return null;
      } catch (e: any) {
         throw new Error(e?.message);         
      } 
   }
}