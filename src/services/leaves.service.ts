import express, { Request, Response } from "express";
import { LeaveController } from "../controllers/leaves.controller";
import { ILeaveSchema } from "../types/schemas";

export async function insertLeaves(req: Request, res: Response) {
   const controller = new LeaveController<ILeaveSchema>();
   controller.body = req?.body;

   const message = await controller?.insert();
   res.send(message).end();
}

export async function listOfLeaves(req: Request, res: Response) {
   const controller = new LeaveController<ILeaveSchema>();
   controller.aggregate = [];

   const message = await controller?.list();
   res.send(message).end();
}