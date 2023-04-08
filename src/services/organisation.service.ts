import express, { Request, Response } from "express";
import { OrganisationController } from "../controllers/organisation.controller";
import { IOrganisationSchema } from "../types/schemas";

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