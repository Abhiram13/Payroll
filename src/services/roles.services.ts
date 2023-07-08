import { Request, Response } from "../services/server";
import { RolesController } from "../controllers/roles.controller";
import { IRoleSchema, RoleIdentifier } from "../types/schemas";
import { StatusCodes } from "../types/login.types";
import { ApiReponse } from "./globals";

export async function insertRoles(req: Request, res: Response) {
   const controller = new RolesController();
   const payload: IRoleSchema = req?.body;

   if (!Object.values(RoleIdentifier).includes(payload?.identifier)) {
      ApiReponse<null>({
         res,
         status: StatusCodes?.BAD_REQUEST,
         message: "Invalid Role identifier"
      });
      return;
   }
   
   controller.body = req?.body as IRoleSchema;

   // const status: StatusCodes = await controller?.insert();
   // const message: string = status === StatusCodes?.OK ? "Document inserted successfully" : "Inserting document failed";
   // ApiReponse<null>(res, StatusCodes?.OK, null, "NO NEW ROLES WILL BE ADDED");
   ApiReponse<null>({
      res,
      status: StatusCodes?.OK,
      message: "NO NEW ROLES WILL BE ADDED"
   });
}

export async function updateRoles(req: Request, res: Response) {
   const controller = new RolesController();
   const roleId: string | null = req?.params?.id;
   const payload: IRoleSchema = req?.body;

   if (!roleId) {
      // ApiReponse<null>(res, StatusCodes?.BAD_REQUEST, null, "Invalid Role id");
      ApiReponse<null>({
         res,
         status: StatusCodes?.BAD_REQUEST,
         message: "Invalid Role id"
      });
      return;
   }

   if (!Object.values(RoleIdentifier).includes(payload?.identifier)) {
      // ApiReponse<null>(res, StatusCodes?.BAD_REQUEST, null, "Invalid Role identifier");
      ApiReponse<null>({
         res,
         status: StatusCodes?.BAD_REQUEST,
         message: "Invalid Role identifier"
      });
      return;
   }

   // const status: StatusCodes = await controller?.update({_id: new ObjectId(roleId)}, {$set: payload});
   // const message: string = status === StatusCodes?.OK ? "Document updated successfully" : "Updating document failed";
   // ApiReponse<null>(res, StatusCodes?.OK, null, "ROLES ARE ALREADY UP-TO-DATE");
   ApiReponse<null>({
      res,
      status: StatusCodes?.OK,
      message: "ROLES ARE ALREADY UP-TO-DATE"
   });
}

export async function listOfRoles(req: Request, res: Response) {
   const controller = new RolesController();
   controller.aggregate = [];

   const result: IRoleSchema[] = await controller?.list();
   const status: StatusCodes = result?.length ? StatusCodes?.OK : StatusCodes?.NO_DATA;

   // ApiReponse<IRoleSchema[]>(res, status, result, undefined);
   ApiReponse<IRoleSchema[]>({
      res,
      status: status,
      result
   });
}