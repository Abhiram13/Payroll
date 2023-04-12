import express, { Request, Response } from "express";
import {IApiResponse, ILoginRequest, ILoginResponse, StatusCodes, IMongo, IEncryptedToken} from "../types/login.types";
import { EmployeeController } from "./employee.controller";
import { IEmployeeSchema } from "../types/schemas";
import Hashing from "../services/hashing";

export class LoginController {
   async login(payload: ILoginRequest): Promise<ILoginResponse | null> {
      const controller = new EmployeeController<IEmployeeSchema & IMongo>();
      controller.aggregate = [
         {$match: {$and: [{username: payload?.user_name, password: payload?.password}]}}
      ];

      const list: (IEmployeeSchema & IMongo)[] = await controller?.list();
      
      if (list?.length) {
         let {_id, manager_id, organisation_id, role_id, username, first_name, last_name} = list[0];
         const payload: IEncryptedToken = {id: _id, mId: manager_id, oId: organisation_id, rID: role_id, userName: username};
         const token = Hashing.encrypt<IEncryptedToken>(payload);

         return {name: `${first_name} ${last_name}`, token: token};
      }

      return null;
   }
}