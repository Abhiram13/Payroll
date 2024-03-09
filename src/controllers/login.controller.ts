import {RolesController, EmployeeController} from "./export.controller";
import {IEmployeeSchema, IMongo, ILoginRequest, ILoginResponse, IRoleIdentifier, Role, IEncryptedToken} from "../types/export.types";
import {Hashing, MyError} from "../services/export.services";

type EmployeeWithMongo = (IEmployeeSchema & IMongo);

export class LoginController {
   #payload: ILoginRequest;

   constructor (payload: ILoginRequest) {
      this.#payload = payload;

      if (!payload?.user_name || !payload?.password) throw new Error('Invalid login payload provided');
   }

   /**
    * fetches employee with given User name and Password
    * @returns Employee details if exist
    * @returns null if Employee does not exists
    */
   async #employeeList(): Promise<EmployeeWithMongo[] | null> {
      const controller = new EmployeeController();
      controller.aggregate = [
         { $match: { $and: [{ username: this.#payload?.user_name, password: this.#payload?.password }] } }
      ];

      const list: EmployeeWithMongo[] = await controller?.list() as EmployeeWithMongo[];
      return list?.length ? list : null;
   }

   async login(): Promise<ILoginResponse | null> {
      try {
         const list: EmployeeWithMongo[] | null = await this.#employeeList();

         if (list?.length) {
            const { _id: employee_id, manager_id, organisation_id, role_id, username, first_name, last_name } = list[0];
            const roleController = new RolesController();
            const result: IRoleIdentifier | null = await roleController?.findById(role_id, {identifier: 1}, {_id: 0, name: 0});
            const identifier: Role | null = result?.identifier || null;

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
         throw new MyError(e);
      } 
   }
}