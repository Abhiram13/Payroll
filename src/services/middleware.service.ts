import {NextFunction, Request, Response} from "express";
import Hashing from "./hashing";
import { IEncryptedToken, StatusCodes } from "../types/login.types";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema, RoleIdentifier } from "../types/schemas";

export async function authentication(req: Request, res: Response, next: NextFunction) {
   const token: string | undefined = req?.headers['authorization'];

   try {
      if (token) {
         const decrypted = Hashing?.decrypt<IEncryptedToken>(token);         
         const empController = new EmployeeController<IEmployeeSchema>();
         const employee = await empController.findById(decrypted?.id?.toString());
   
         if (employee) {
            res.locals.payload = decrypted;
            next();
            return;
         }
   
         res?.status(StatusCodes?.UN_AUTHORISE)?.send({message: "Un Authorise"})?.end();
         return;
      };
   
      res?.status(StatusCodes?.UN_AUTHORISE)?.send({message: "Token is invalid/ not provided"})?.end();
      return;
   } catch (e: any) {
      res?.status(StatusCodes?.UN_AUTHORISE)?.send({message: e?.message})?.end();
      return;      
   }   
}

export async function authorization(req: Request, res: Response, next: NextFunction, roles: RoleIdentifier[]) {

}