import {NextFunction, Request, Response} from "express";
import Hashing from "./hashing";
import { IEncryptedToken, StatusCodes } from "../types/login.types";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema, RoleIdentifier } from "../types/schemas";
import { ApiReponse } from "./login.service";
import Logger from "./logger.service";

export async function authentication(req: Request, res: Response, next: NextFunction) {
   const token: string | undefined = req?.headers['authorization'];

   try {
      if (token) {
         const decrypted = Hashing?.decrypt<IEncryptedToken>(token);
         const currentTime: number = new Date().getTime();
         const durationDiff: number = currentTime - decrypted?.time;
         const tenMinutes: number = 600000;

         if (durationDiff > tenMinutes) {
            ApiReponse<null>(res, StatusCodes?.UN_AUTHORISE, null, "Token expired");
            return;
         }

         const empController = new EmployeeController<IEmployeeSchema>();
         const employee = await empController.findById(decrypted?.id?.toString());
   
         if (employee) {
            res.locals.payload = decrypted;
            next();
            return;
         }
   
         ApiReponse<null>(res, StatusCodes?.UN_AUTHORISE, null, "Un Authorise");
         return;
      };
   
      ApiReponse<null>(res, StatusCodes?.UN_AUTHORISE, null, "Token is invalid/ not provided");
      return;
   } catch (e: any) {
      Logger?.error(e?.message);
      ApiReponse<null>(res, StatusCodes?.UN_AUTHORISE, null, e?.message, true);
      return;      
   }   
}

export async function authorization(req: Request, res: Response, next: NextFunction, roles: RoleIdentifier[]) {
   try {
      const payload: IEncryptedToken = res?.locals?.payload;

      if (!roles?.includes(payload?.roleIdentifier)) {
         ApiReponse<null>(res, StatusCodes?.FORBIDDEN, null, "Current user do not have access to this API", true);
         return;
      }

      next();
      return;
   } catch (e: any) {
      ApiReponse<null>(res, StatusCodes?.UN_AUTHORISE, null, e?.message, true);
      return;
   }
}