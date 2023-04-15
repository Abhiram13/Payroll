import express, { Request, Response } from "express";
import { OrganisationController } from "../controllers/organisation.controller";
import { IOrganisationSchema, IEmployeeSchema, IRoleSchema, RoleIdentifier } from "../types/schemas";
import { IEncryptedToken, StatusCodes } from "../types/login.types";
import { ApiReponse } from "./login.service";
import { tables } from "./globals";
import { EmployeeController } from "../controllers/employee.controller";
import { RolesController } from "../controllers/roles.controller";

async function fetchEmployee(id: string): Promise<{role_id: string} | null> {
   try {
      const empController = new EmployeeController<IEmployeeSchema>();
      const result: {role_id: string} | null = await empController?.findById(id, {role_id: 1}, {_id: 0});
      return result;
   } catch (e: any) {
      console.log('#1 ', e?.message);
      return null;
   }
}

async function fetchRoleIdentifier(id: string): Promise<{identifier: number} | null> {
   try {
      const roleController = new RolesController<IRoleSchema>();
      const result: {identifier: RoleIdentifier} | null = await roleController.findById(id, {identifier: 1}, {_id: 0});
      return result;
   } catch (e: any) {
      console.log('#2 ', e?.message);
      return null;
   }
}

export async function insertOrganisation(req: Request, res: Response) {
   const controller = new OrganisationController<IOrganisationSchema>();    
   const payload: IOrganisationSchema = req?.body;   
   const employee = await fetchEmployee(payload?.admin_id);   

   if (!employee) {
      ApiReponse<null>(res, StatusCodes?.BAD_REQUEST, null, "Employee do not exist with given Admin Id");
      return;
   }

   const role = await fetchRoleIdentifier(employee?.role_id);

   if (role?.identifier !== RoleIdentifier?.OrganisationAdmin) {
      ApiReponse<null>(res, StatusCodes?.BAD_REQUEST, null, "Invalid Admin id");
      return;
   }

   controller.body = payload;

   const message = await controller?.insert();
   res.send(message).end();
}

export async function listOfOrganisations(req: Request, res: Response) {
   const controller = new EmployeeController<IEmployeeSchema>();
   const orgId: string = res?.locals?.payload?.organisationId;   
   controller.aggregate = [
      {$match: {"organisation_id": orgId}},
      {
         $addFields: {organisation_id: {$toObjectId: "$organisation_id"}}
      },
      {
         $lookup: {
            from: tables?.organisation,
            localField: "organisation_id",
            foreignField: "_id",
            as: "Organisation"
         }
      },
      {$project: {username: 0, password: 0}},
      {$project: {
         organisation_name: {
            $reduce: {
               input: "$Organisation.name",
               initialValue: "",
               in: {$concat: ["$$value", "$$this"]}
            }
         },
         first_name: 1, last_name: 1, phone: 1, email: 1, date_of_birth: 1
      }}    
   ];

   const data: IEmployeeSchema[] = await controller?.list();
   const status: StatusCodes = data?.length ? StatusCodes?.OK : StatusCodes?.NO_DATA;
   const message: string | undefined = data?.length ? undefined : "No Employee found at given Organisation";
   ApiReponse<IEmployeeSchema[]>(res, status, data, message);
}

export async function fetchOrganisation(req: Request, res: Response) {
   const token: IEncryptedToken | null = res?.locals?.payload;
   const controller = new OrganisationController<IOrganisationSchema>();
   const organisation: IOrganisationSchema | null = await controller.findById(token?.organisationId || "");
   const status: StatusCodes = organisation ? StatusCodes?.OK : StatusCodes?.NO_DATA;
   const message: string | undefined = organisation ? undefined : 'No Organisation found';   
   
   ApiReponse<IOrganisationSchema | null>(res, status, organisation, message);
}