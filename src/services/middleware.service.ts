import Hashing from "./hashing";
import { IEncryptedToken, StatusCodes } from "../types/login.types";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema, RoleIdentifier } from "../types/schemas";
import Logger from "./logger.service";
import { ApiReponse } from "./globals";
import { Request, Response } from "./server";

export async function authentication(req: Request, res: Response) {
   const token: string | undefined = req?.headers['authorization'];

   try {
      if (token) {
         const decrypted = Hashing?.decrypt<IEncryptedToken>(token);
         const currentTime: number = new Date().getTime();
         const durationDiff: number = currentTime - decrypted?.time;
         const tenMinutes: number = 600000;

         if (durationDiff > tenMinutes) {
            ApiReponse<null>({ res, status: StatusCodes?.UN_AUTHORISE, message: "token expired" });
            return;
         }

         const empController = new EmployeeController();
         const employee = await empController.findById(decrypted?.id?.toString());
   
         if (employee && employee?.username) {            
            res.locals.payload = decrypted;            
            return;
         }
   
         ApiReponse<null>({ res, status: StatusCodes?.UN_AUTHORISE, message: "Un Authorise" });
         return;
      };
   
      ApiReponse<null>({ res, status: StatusCodes?.UN_AUTHORISE, message: "token is invalid/ not provided" });
      return;
   } catch (e: any) {
      Logger?.error(`Error at Authenticate service: ${e?.message}, Stack is: ${e?.stack}`);
      ApiReponse<null>({ res, status: StatusCodes?.UN_AUTHORISE, message: e?.message });
      return;      
   }   
}

export async function authorization(req: Request, res: Response, roles: RoleIdentifier[]) {
   try {
      const payload: IEncryptedToken = res?.locals?.payload;

      if (!roles?.includes(payload?.roleIdentifier)) {
         ApiReponse<null>({ res, status: StatusCodes?.FORBIDDEN, message: "Current user do not have access to this API" });
         return;
      }

      return;
   } catch (e: any) {
      ApiReponse<null>({ res, status: StatusCodes?.UN_AUTHORISE, message: e?.message });
      return;
   }
}