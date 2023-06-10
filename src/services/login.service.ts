import { Request, Response } from "express";
import { LoginController } from "../controllers/login.controller";
import { StatusCodes, ILoginResponse } from "../types/login.types";
import Logger from "./logger.service";
import { ApiReponse } from "./globals";

export async function login(req: Request, res: Response) {
   try {
      const controller = new LoginController(req?.body);
      const data = await controller?.login();
      const status: StatusCodes = data?.token ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      const message: string | undefined = data ? undefined : "Invalid Credentials";
      throw new Error('Test error');
      // ApiReponse<ILoginResponse | null>({
      //    res, 
      //    status: status,
      //    result: data, 
      //    message
      // });
   } catch (e: any) {
      Logger?.error(e?.message);
      console.log('Error caught at: ', e);
      // ApiReponse<null>({
      //    res, 
      //    status: StatusCodes?.SERVER_ERROR, 
      //    error: true,
      //    message: "Invalid Credentials"
      // });
      throw new Error('Test error');
   }
}