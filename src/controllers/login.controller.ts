import express, { Request, Response } from "express";
import {IApiResponse, ILoginRequest, ILoginResponse, StatusCodes} from "../types/login.types";
import { EmployeeController } from "./employee.controller";
import { IEmployeeSchema } from "../types/schemas";

export class LoginController {
   async login(payload: ILoginRequest): Promise<ILoginResponse> {
      const controller = new EmployeeController<IEmployeeSchema>();
      controller.aggregate = [
         {$match: {$and: [{username: payload?.user_name, password: payload?.password}]}}
      ];

      const list = await controller?.list();

      return {employee_name: list[0]?.first_name, token: ""};
   }
}