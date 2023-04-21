import { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema, IOrganisationSchema } from "../types/schemas";
import { OrganisationController } from "../controllers/organisation.controller";
import { ObjectId } from "mongodb";
import { ApiReponse } from "./login.service";
import { StatusCodes } from "../types/login.types";

export async function insertEmployee(req: Request, res: Response) {
   const body: IEmployeeSchema = req?.body;
   const controller = new EmployeeController<IEmployeeSchema>();   
   const orgControler = new OrganisationController<{_id: ObjectId}>();
   const org = await orgControler?.findById(body?.organisation_id, {_id: 1});

   if (org?._id?.toString() !== body?.organisation_id) {
      ApiReponse<null>(res, StatusCodes?.BAD_REQUEST, null, "Organisation does not exist with given value");
      return;
   }
   
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