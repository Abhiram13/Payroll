import {ApiReponse, Logger} from "./export.services";
import {LoginController} from "../controllers/export.controller";
import {Request, Response, StatusCode, ILoginResponse} from "../types/export.types"

export async function login(req: Request, res: Response) {
   try {
      const controller = new LoginController(req?.body);
      const data = await controller?.login();
      const status: StatusCode = data?.token ? StatusCode.OK : StatusCode.BAD_REQUEST;
      const message: string | undefined = data?.token ? undefined : "Invalid Credentials";
      ApiReponse<ILoginResponse | null>({ res, status: status, result: data, message });
   } catch (e: any) {
      Logger?.error(`Error at Login service: ${e?.message}, Stack is: ${e?.stack}`);
      ApiReponse<null>({
         res, 
         status: StatusCode?.SERVER_ERROR, 
         error: true,
         message: "Invalid Credentials"
      });
   }
}