import { Request, Response } from "express";
import { OrganisationController } from "../controllers/organisation.controller";
import { IOrganisationSchema, IEmployeeSchema, IRoleSchema, RoleIdentifier } from "../types/schemas";
import { IEncryptedToken, StatusCodes } from "../types/login.types";
import { tables, ApiReponse, TimerMethod } from "./globals";
import { EmployeeController } from "../controllers/employee.controller";
import { RolesController } from "../controllers/roles.controller";

export async function insertOrganisation(req: Request, res: Response) {
   
   // defining messages based on status codes
   let messageMap = new Map<StatusCodes, string>();
   messageMap.set(StatusCodes?.OK, "Organisation inserted successfully");
   messageMap.set(StatusCodes?.NOT_MODIFIED, "Insering Organisation failed");
   messageMap.set(StatusCodes?.BAD_REQUEST, "Provided payload in invalid / invalid admin_id");
   messageMap.set(StatusCodes?.FORBIDDEN, "Current user do not have access to create an organisation");

   const controller = new OrganisationController();
   const empController = new EmployeeController();
   const roleController = new RolesController();
   const payload: IOrganisationSchema = req?.body;   
   const employee = await empController?.fetchEmployeeByAdminId(payload?.admin_id);
   
   // check if employee is valid
   if (!employee?.role_id) {
      ApiReponse<null>({res, status: StatusCodes?.BAD_REQUEST, message: messageMap.get(StatusCodes?.BAD_REQUEST)});
      return;
   }

   const role = await roleController?.fetchRoleIdentifierByEmpRoleId(employee?.role_id || "");

   // if user is valid, but not organisation admin
   if (role?.identifier !== RoleIdentifier?.OrganisationAdmin) {
      ApiReponse<null>({res, status: StatusCodes?.FORBIDDEN, message: messageMap?.get(StatusCodes?.FORBIDDEN)});
      return;
   }

   controller.body = payload;

   // inserting organisation in DB
   const status: StatusCodes = await controller?.insert();
   ApiReponse<null>({res, status: status, message: messageMap?.get(status)});
}

export async function listOfOrganisations(req: Request, res: Response) {
   await TimerMethod<IEmployeeSchema[]>(res, async () => {
      const controller = new EmployeeController();
      const orgId: string = res?.locals?.payload?.organisationId;
      controller.aggregate = [
         { $match: { "organisation_id": orgId } },
         {
            $addFields: { organisation_id: { $toObjectId: "$organisation_id" } }
         },
         {
            $lookup: {
               from: tables?.organisation,
               localField: "organisation_id",
               foreignField: "_id",
               as: "Organisation"
            }
         },
         { $project: { username: 0, password: 0 } },
         {
            $project: {
               organisation_name: {
                  $reduce: {
                     input: "$Organisation.name",
                     initialValue: "",
                     in: { $concat: ["$$value", "$$this"] }
                  }
               },
               first_name: 1, last_name: 1, phone: 1, email: 1, date_of_birth: 1
            }
         }
      ];

      const data: IEmployeeSchema[] = await controller?.list();
      const status: StatusCodes = data?.length ? StatusCodes?.OK : StatusCodes?.NO_DATA;
      const message: string | undefined = data?.length ? undefined : "No Employee found at given Organisation";      

      return {status, result: data, message};
   });
}

export async function fetchOrganisation(req: Request, res: Response) {
   const token: IEncryptedToken | null = res?.locals?.payload;
   const controller = new OrganisationController();
   const organisation: IOrganisationSchema | null = await controller.findById(token?.organisationId || "");
   const status: StatusCodes = organisation ? StatusCodes?.OK : StatusCodes?.NO_DATA;
   const message: string | undefined = organisation ? undefined : 'No Organisation found';   
   
   ApiReponse<IOrganisationSchema | null>({
      res,
      status: status,
      result: organisation,
      message
   });
}