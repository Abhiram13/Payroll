import express, { Request, Response } from "express";
import { RolesController } from "../controllers/roles.controller";
import { IRoleSchema } from "../types/schemas";

export async function insertRoles(req: Request, res: Response) {
   const controller = new RolesController<IRoleSchema>();
   controller.body = req?.body;

   const message = await controller?.insert();
   res.send(message).end();
}

export async function listOfRoles(req: Request, res: Response) {
   const controller = new RolesController<IRoleSchema>();
   controller.aggregate = [];

   const message = await controller?.list();
   res.send(message).end();
}