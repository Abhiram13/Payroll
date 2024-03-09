import {IEncryptedToken, StatusCode, Role, Request, Response} from "../types/export.types";
import {EmployeeController, RolesController} from "../controllers/export.controller";
import {Logger, ApiReponse, Hashing} from "./export.services";

export async function authentication(req: Request, res: Response) {
   const token: string | undefined = req?.headers['authorization'];

   try {
      if (token) {
         const decrypted = Hashing?.decrypt<IEncryptedToken>(token);
         const currentTime: number = new Date().getTime();
         const durationDiff: number = currentTime - decrypted?.time;
         const tenMinutes: number = 600000;

         if (durationDiff > tenMinutes) {
            ApiReponse<null>({ res, status: StatusCode?.UNAUTHORISE, message: "token expired" });
            return;
         }

         const empController = new EmployeeController();
         const employee = await empController.findById(decrypted?.id?.toString());
   
         if (employee && employee?.username) {
            const roleController = new RolesController();
            const role = await roleController.fetchRoleIdentifierByEmpRoleId(employee.role_id);             
            res.locals.payload = {...decrypted, roleIdentifier: role?.identifier};            
            return;
         }
   
         ApiReponse<null>({ res, status: StatusCode?.UNAUTHORISE, message: "Un Authorise" });
         return;
      };
   
      ApiReponse<null>({ res, status: StatusCode?.UNAUTHORISE, message: "token is invalid/ not provided" });
      return;
   } catch (e: any) {
      Logger?.error(e, `Error at Authenticate service`);
      ApiReponse<null>({ res, status: StatusCode?.UNAUTHORISE, message: e?.message });
      return;      
   }   
}

/**
 * @param {Role} roles - List of roles that needs to be authorised 
 */
export async function authorization(req: Request, res: Response, roles: Role[]) {
   try {
      const payload: IEncryptedToken = res?.locals?.payload;

      if (!roles?.includes(payload?.roleIdentifier)) {
         ApiReponse<null>({ res, status: StatusCode?.FORBIDDEN, message: "Current user do not have access to this API" });
         return;
      }

      return;
   } catch (e: any) {
      ApiReponse<null>({ res, status: StatusCode?.UNAUTHORISE, message: e?.message });
      return;
   }
}