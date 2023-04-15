import { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema } from "../types/schemas";

export async function insertEmployee(req: Request, res: Response) {
   const body: IEmployeeSchema = req?.body;
   const controller = new EmployeeController<IEmployeeSchema>();
   controller.body = body;

   const message = await controller?.insert();   
   res.send(message).end();
}

export async function fetchEmployee(req: Request, res: Response) {
   const id: string = req?.params?.id;
   const controller = new EmployeeController<IEmployeeSchema>();
   const result = await controller?.findById(id, {first_name: 1, last_name: 1});
   
   res.send(result).end();
}