import {ApiReponse, Logger} from "./export.services";
import {LoginController} from "../controllers/export.controller";
import {Request, Response, StatusCode, ILoginResponse, ErrorType} from "../types/export.types"

export async function login(req: Request, res: Response) {
   try {
      const controller = new LoginController(req?.body);
      const data: ILoginResponse | null = await controller?.login();
      const status: StatusCode = data?.token ? StatusCode.OK : StatusCode.BAD_REQUEST;
      const message: string | undefined = data?.token ? undefined : "Invalid Credentials";
      ApiReponse<ILoginResponse | null>({ res, status: status, result: data, message });
   } catch (e: any) {
      Logger.error(e, `Error testing at Login service. Stack ${e?.stack}`);
      
      let message: string;

      switch (e?.name) {
         case ErrorType.MongoInvalidArgumentError: message = "Something went wrong when connecting to DB"; break;
         case ErrorType.TypeError: message = "Something went wrong at parsing of data"; break;
         default: message = "Invalid credentials"; break;
      }      

      ApiReponse<null>({
         res, 
         status: StatusCode?.SERVER_ERROR, 
         error: true,
         message
      });
   }
}