import {ApiReponse, TimerMethod, tables} from "./export.services";
import {OrganisationController, EmployeeController, RolesController} from "../controllers/export.controller";
import {Request, Response, StatusCode, Role, IOrganisationSchema, IEmployeeSchema, IEncryptedToken} from "../types/export.types"

export async function insertOrganisation(req: Request, res: Response) {
   try {
      // defining messages based on status codes
      let messageMap = new Map<StatusCode, string>();
      messageMap.set(StatusCode?.OK, "Organisation inserted successfully");
      messageMap.set(StatusCode?.NOT_MODIFIED, "Insering Organisation failed");
      messageMap.set(StatusCode?.BAD_REQUEST, "Provided payload in invalid / invalid admin_id");
      messageMap.set(StatusCode?.FORBIDDEN, "Given admin_id does not belongs to Organisation admin");

      const controller = new OrganisationController();
      const empController = new EmployeeController();
      const roleController = new RolesController();
      const payload: IOrganisationSchema = req?.body;
      const employee = await empController?.fetchEmployeeByAdminId(payload?.admin_id);      

      // check if employee is valid
      if (!employee?.role_id) {
         ApiReponse<null>({ res, status: StatusCode?.BAD_REQUEST, message: messageMap.get(StatusCode?.BAD_REQUEST) });
         return;
      }

      const role = await roleController?.fetchRoleIdentifierByEmpRoleId(employee?.role_id || "");

      // if user is valid, but not organisation admin
      if (role?.identifier !== Role?.OrganisationAdmin) {
         ApiReponse<null>({ res, status: StatusCode?.FORBIDDEN, message: messageMap?.get(StatusCode?.FORBIDDEN) });
         return;
      }

      const regex = new RegExp([`^`, payload.name, `$`].join(``), `i`);
      const list = await controller.find({name: regex});

      if (list?.length) {
         ApiReponse<null>({ res, status: StatusCode?.BAD_REQUEST, message: "Organisation already exists with given name" });
         return;
      }

      controller.body = payload;

      // inserting organisation in DB
      const status: StatusCode = await controller?.insert();
      ApiReponse<null>({ res, status: status, message: messageMap?.get(status) });
   } catch (e: any) {
      ApiReponse<null>({ res, status: StatusCode?.SERVER_ERROR, message: e?.message });
   }      
}

export async function listOfOrganisations(req: Request, res: Response) {
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
   const status: StatusCode = StatusCode?.OK;
   const message: string | undefined = data?.length ? undefined : "No Employee found at given Organisation";

   ApiReponse<IEmployeeSchema[]>({ res, status, message });   
}

// fetches list of organisation if loggedin user is super admin, 
// else fetches only the organsation the user belongs to
export async function fetchOrganisation(req: Request, res: Response) {
   try {
      const token: IEncryptedToken | null = res?.locals?.payload;
      const controller = new OrganisationController();
      const roleController = new RolesController();
      const role = await roleController.fetchRoleIdentifierByEmpRoleId(token?.roleId || "")
      let organisation: IOrganisationSchema | IOrganisationSchema[] | null = null;

      if (role?.identifier === Role?.SuperAdmin) {
         organisation = await controller?.list();
      } else {
         organisation = await controller.findById(token?.organisationId || "");
      }

      const status: StatusCode = StatusCode?.OK;
      const message: string | undefined = organisation ? undefined : 'No Organisation found';

      ApiReponse<IOrganisationSchema | IOrganisationSchema[] | null>({ res, status: status, result: organisation, message });
      return;
   } catch (e: any) {
      ApiReponse<null>({ res, status: StatusCode.SERVER_ERROR, message: e?.message });
      return;
   }   
}