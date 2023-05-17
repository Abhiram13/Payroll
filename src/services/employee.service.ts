import { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema, IOrganisationSchema, IRoleSchema, RoleIdentifier } from "../types/schemas";
import { OrganisationController } from "../controllers/organisation.controller";
import { ObjectId } from "mongodb";
import { ApiReponse } from "./login.service";
import { StatusCodes } from "../types/login.types";
import Logger from "./logger.service";
import { RolesController } from "../controllers/roles.controller";

/**
 * Manager id - Find if manager is reporting manager or not, if not throw error
 * Organisation id - Find if the organisation exists and find the given manager belongs to that organisation and find if that organisation contains other reporting manager
 * Role id - Find if role is not of Super admin
 */

export async function insertEmployee(req: Request, res: Response) {
   const body: IEmployeeSchema = req?.body;
   const controller = new EmployeeController<IEmployeeSchema>();      
   const orgControler = new OrganisationController<{_id: ObjectId}>();
   const org = await orgControler?.findById(body?.organisation_id, {_id: 1});
   const manager = await controller?.findById(body?.manager_id);
   const roleController = new RolesController<IRoleSchema>();
   const identifier: {identifier: RoleIdentifier} | null = await roleController.findById(body?.role_id, {identifier: 1}, {name: 0, _id: 0});

   Logger.log(manager);

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