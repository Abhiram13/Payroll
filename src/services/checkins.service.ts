import express, { Request, Response } from "express";
import { CheckInController } from "../controllers/checkins.controller";
import { ICheckInSchema } from "../types/schemas";

export async function insertCheckIns(req: Request, res: Response) {
   const controller = new CheckInController<ICheckInSchema>();
   controller.body = req?.body;

   const message = await controller?.insert();
   res.send(message).end();
}

export async function listOfCheckIns(req: Request, res: Response) {
   const controller = new CheckInController<ICheckInSchema>();
   controller.aggregate = [];

   const message = await controller?.list();
   res.send(message).end();
}