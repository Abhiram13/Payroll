import express, { Request, Response } from "express";
import { LoginController } from "../controllers/login.controller";
import { StatusCodes, IApiResponse, ILoginResponse } from "../types/login.types";
import Logger from "./logger.service";

export async function login(req: Request, res: Response) {
   try {
      const controller = new LoginController(req?.body);
      const data = await controller?.login();
      const status: StatusCodes = data?.token ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
      const message: string | undefined = data ? undefined : "Invalid Credentials";

      ApiReponse<ILoginResponse | null>(res, status, data, message);
   } catch (e: any) {
      Logger?.error(e?.message);
      console.log('Error caught at: ', e);
      ApiReponse<null>(res, StatusCodes?.UN_AUTHORISE, null, "Invalid Credentials", true);
   }
}

export function ApiReponse<T>(res: Response, status: StatusCodes, result?: T, message?: string, error: boolean = false): void {
   const response: IApiResponse<T> = { status, error };

   if (result) response.result = result;
   if (message) response.message = message;

   res?.status(200).send(response)?.end();
}