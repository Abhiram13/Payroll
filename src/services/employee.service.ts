import express, { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema } from "../types/schemas";
import { OrganisationController } from "../controllers/organisation.controller";

export async function insertEmployee(req: Request, res: Response) {
   const body: IEmployeeSchema = req?.body;
   const controller = new EmployeeController<IEmployeeSchema>();
   // const organisationController = new OrganisationController().findById(body?.organisation_id);
   controller.body = req?.body;

   // const message = await controller?.insert();
   const message = "ad";
   res.send(message).end();
}