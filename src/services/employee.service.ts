import express, { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema } from "../types/schemas";
import { OrganisationController } from "../controllers/organisation.controller";

export async function insertEmployee(req: Request, res: Response) {
   const body: IEmployeeSchema = req?.body;
   const controller = new EmployeeController<IEmployeeSchema>();
   controller.body = req?.body;

   const message = await controller?.insert();   
   res.send(message).end();
}