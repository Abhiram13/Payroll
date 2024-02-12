import {RolesController} from "../controllers/export.controller";
import {RoleIdentifier, IRoleSchema, Request, Response, StatusCode} from "../types/export.types";
import {ApiReponse} from "./export.services";

export async function insertRoles(req: Request, res: Response) {
   const controller = new RolesController();
   const payload: IRoleSchema = req?.body;

   if (!Object.values(RoleIdentifier).includes(payload?.identifier)) {
      ApiReponse<null>({
         res,
         status: StatusCode?.BAD_REQUEST,
         message: "Invalid Role identifier"
      });
      return;
   }
   
   controller.body = req?.body as IRoleSchema;

   // const status: StatusCode = await controller?.insert();
   // const message: string = status === StatusCode?.OK ? "Document inserted successfully" : "Inserting document failed";
   // ApiReponse<null>(res, StatusCode?.OK, null, "NO NEW ROLES WILL BE ADDED");
   ApiReponse<null>({
      res,
      status: StatusCode?.OK,
      message: "NO NEW ROLES WILL BE ADDED"
   });
}

export async function updateRoles(req: Request, res: Response) {
   const controller = new RolesController();
   const roleId: string | null = req?.params?.id;
   const payload: IRoleSchema = req?.body;

   if (!roleId) {
      // ApiReponse<null>(res, StatusCode?.BAD_REQUEST, null, "Invalid Role id");
      ApiReponse<null>({
         res,
         status: StatusCode?.BAD_REQUEST,
         message: "Invalid Role id"
      });
      return;
   }

   if (!Object.values(RoleIdentifier).includes(payload?.identifier)) {
      // ApiReponse<null>(res, StatusCode?.BAD_REQUEST, null, "Invalid Role identifier");
      ApiReponse<null>({
         res,
         status: StatusCode?.BAD_REQUEST,
         message: "Invalid Role identifier"
      });
      return;
   }

   // const status: StatusCode = await controller?.update({_id: new ObjectId(roleId)}, {$set: payload});
   // const message: string = status === StatusCode?.OK ? "Document updated successfully" : "Updating document failed";
   // ApiReponse<null>(res, StatusCode?.OK, null, "ROLES ARE ALREADY UP-TO-DATE");
   ApiReponse<null>({
      res,
      status: StatusCode?.OK,
      message: "ROLES ARE ALREADY UP-TO-DATE"
   });
}

export async function listOfRoles(req: Request, res: Response) {
   const controller = new RolesController();
   controller.aggregate = [];

   const result: IRoleSchema[] = await controller?.list();
   const status: StatusCode = result?.length ? StatusCode?.OK : StatusCode?.NO_DATA;

   // ApiReponse<IRoleSchema[]>(res, status, result, undefined);
   ApiReponse<IRoleSchema[]>({
      res,
      status: status,
      result
   });
}