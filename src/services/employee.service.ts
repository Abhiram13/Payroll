import express, { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { IEmployeeSchema } from "../types/schemas";

export async function insertEmployee(req: Request, res: Response) {
   const controller = new EmployeeController<IEmployeeSchema>(req?.body);
   const message = await controller?.insert();
   res.send(message).end();
}