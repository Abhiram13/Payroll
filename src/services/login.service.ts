import express, { Request, Response } from "express";
import { LoginController } from "../controllers/login.controller";
import { StatusCodes, IApiResponse, ILoginResponse } from "../types/login.types";

export async function login(req: Request, res: Response) {
   const controller = new LoginController();
   const data = await controller?.login(req?.body);   
   const status: StatusCodes = data?.token ? StatusCodes.OK : StatusCodes.NO_DATA;
   const message: string | undefined  = data ? undefined : "Invalid Credentials";

   ApiReponse<ILoginResponse | null>(res, status, data, message);
}

export function ApiReponse<T>(res: Response, status: StatusCodes, result?: T, message?: string): void {
   const response: IApiResponse<T> = { status };

   if (result) response.result = result;
   if (message) response.message = message;

   res?.status(200).send(response)?.end();
}