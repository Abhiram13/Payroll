import express, { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";

export async function insertEmployee(req: Request, res: Response) {
    const controller = new EmployeeController(req?.body);
    const message = await controller?.insert();
    res.send(message).end();
}