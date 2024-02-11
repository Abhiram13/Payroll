import {ApiReponse, Logger} from "./export.services";
import {OrganisationController, EmployeeController, RolesController} from "../controllers/export.controller";
import {Request, Response, StatusCode, RoleIdentifier, IOrganisationSchema, IEmployeeSchema, ObjectId} from "../types/export.types";

/**
 * Only used to add Organisation admin
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
      // fetch organisation admin_id and _id
      const org = await orgControler?.findById(body?.organisation_id || "", { _id: 1, admin_id: 1 }) as unknown as { _id: ObjectId, admin_id: string };

      // find if given organisation id is valid
      if (org?._id?.toString() !== body?.organisation_id) {
         ApiReponse<null>({ res, status: StatusCode?.BAD_REQUEST, message: "Organisation does not exist with given value" });
         return;
      }

      // find if organisation already has an admin
      if (org?.admin_id) {
         ApiReponse<null>({ res, status: StatusCode?.BAD_REQUEST, message: "Organisation already contains an admin" });
         return;
      }

      const roleIdentifier = await roleControler?.fetchRoleIdentifierByEmpRoleId(body?.role_id);

      // find if the employee is Organisation Admin
      if (roleIdentifier?.identifier !== RoleIdentifier?.OrganisationAdmin) {
         ApiReponse<null>({ res, status: StatusCode?.BAD_REQUEST, message: "role_id is invalid. Role should be organisation admin" });
         return;
      }

      // manager id is not needed when adding organisation admin
      if (body?.manager_id !== null) {
         ApiReponse<null>({ res, status: StatusCode?.BAD_REQUEST, message: "manager_id should not be included at organisation level" });
         return;
      }

      controller.body = body;

      const message = await controller?.insert();
      const map = new Map<StatusCode, string>();
      map.set(StatusCode.BAD_REQUEST, "Something went wrong when inserting the employee");
      map.set(StatusCode.OK, "Employee was successfully added");
      map.set(StatusCode.NOT_MODIFIED, "Adding employee was not successful or not modified");

      ApiReponse<null>({res, status: message, error: false, message: map.get(message)});
   } catch (e: any) {
      Logger.error(`Error at insertEmployee API: ${e?.message}, Stack: ${e?.stack}`);
      ApiReponse<null>({res, status: StatusCode?.SERVER_ERROR, error: true, message: "Something went wrong"});
   }
}

export async function fetchEmployee(req: Request, res: Response) {
   const id: string = req?.params?.id;
   const controller = new EmployeeController();
   const result = await controller?.findById(id, { first_name: 1, last_name: 1 });
   
   ApiReponse<any>({ res, status: StatusCode?.OK, result });
}