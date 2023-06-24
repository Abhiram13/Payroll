import { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema, IRoleSchema, RoleIdentifier } from "../types/schemas";
import { OrganisationController } from "../controllers/organisation.controller";
import { ObjectId } from "mongodb";
import { ApiReponse } from "./globals";
import { StatusCodes } from "../types/login.types";
import Logger from "./logger.service";
import { RolesController } from "../controllers/roles.controller";

/**
 * Manager id - Find if manager is reporting manager or not, if not throw error
 * Organisation id - Find if the organisation exists and find the given manager belongs to that organisation and find if that organisation contains other reporting manager
 * Role id - Find if role is not of Super admin
 */

export async function insertEmployee(req: Request, res: Response) {
   try {
      const body: IEmployeeSchema = req?.body;
      // initiate employee controller
      const controller = new EmployeeController();
      // initiate organisation controller
      const orgControler = new OrganisationController();
      // initiate role controller
      const roleControler = new RolesController();

      // find if given organisation id is valid
      const org = await orgControler?.findById(body?.organisation_id, { _id: 1 }) as unknown as { _id: ObjectId };

      if (org?._id?.toString() !== body?.organisation_id) {
         ApiReponse<null>({ res, status: StatusCodes?.BAD_REQUEST, message: "Organisation does not exist with given value" });
         return;
      }

      // fetch manager
      const manager = await controller?.findById(body?.manager_id);

      Logger.log(manager);

      controller.body = body;

      const message = await controller?.insert();
      res.send(message).end();
   } catch (e: any) {

   }
}

export async function fetchEmployee(req: Request, res: Response) {
   const id: string = req?.params?.id;
   const controller = new EmployeeController();
   const result = await controller?.findById(id, { first_name: 1, last_name: 1 });

   res.send(result).end();
}