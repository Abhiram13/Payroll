import express, { Request, Response } from "express";
import { LoginController } from "../controllers/login.controller";

export async function login(req: Request, res: Response) {
   const controller = new LoginController();
   const data = await controller?.login(req?.body);

   res.send(data).end();
}