import express, { Request, Response } from "express";
import { OrganisationController } from "../controllers/organisation.controller";
import { IOrganisationSchema } from "../types/schemas";
import { IEncryptedToken, StatusCodes } from "../types/login.types";
import { ApiReponse } from "./login.service";

export async function insertOrganisation(req: Request, res: Response) {
   const controller = new OrganisationController<IOrganisationSchema>();
   controller.body = req?.body;

   const message = await controller?.insert();
   res.send(message).end();
}

export async function listOfOrganisations(req: Request, res: Response) {
   const controller = new OrganisationController<IOrganisationSchema>();
   controller.aggregate = [];

   const message = await controller?.list();
   res.send(message).end();
}

export async function fetchOrganisation(req: Request, res: Response) {
   const token: IEncryptedToken | null = res?.locals?.payload;
   const controller = new OrganisationController<IOrganisationSchema>();
   const organisation: IOrganisationSchema | null = await controller.findById(token?.oId || "");
   const status: StatusCodes = organisation ? StatusCodes?.OK : StatusCodes?.NO_DATA;
   const message: string | undefined = organisation ? undefined : 'No Organisation found';   
   
   ApiReponse<IOrganisationSchema | null>(res, status, organisation, message);
}