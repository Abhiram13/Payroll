import { Request, Response } from "express";
import { OrganisationController } from "../controllers/organisation.controller";
import { IOrganisationSchema, IEmployeeSchema, IRoleSchema, RoleIdentifier } from "../types/schemas";
import { IEncryptedToken, StatusCodes } from "../types/login.types";
import { tables, ApiReponse, TimerMethod } from "./globals";
import { EmployeeController } from "../controllers/employee.controller";
import { RolesController } from "../controllers/roles.controller";

export async function insertOrganisation(req: Request, res: Response) {
   const controller = new OrganisationController<IOrganisationSchema>();
   const empController = new EmployeeController();
   const roleController = new RolesController();
   const payload: IOrganisationSchema = req?.body;   
   const employee = await empController?.fetchEmployeeByAdminId(payload?.admin_id);
   const role = await roleController?.fetchRoleIdentifierByEmpRoleId(employee?.role_id || "");

   if (employee && role?.identifier !== RoleIdentifier?.OrganisationAdmin) {
      ApiReponse<null>({
         res,
         status: StatusCodes?.BAD_REQUEST,
         message: "Invalid admin_id"
      });
      return;
   }

   controller.body = payload;

   const status: StatusCodes = await controller?.insert();
   const message: string = status === StatusCodes?.OK ? "Organisation inserted successfully" : "Insering Organisation failed";   
   ApiReponse<null>({
      res,
      status: status,
      message: message
   });
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
   const controller = new OrganisationController<IOrganisationSchema>();
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