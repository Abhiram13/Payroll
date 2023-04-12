import express, { Request, Response } from "express";
import { OrganisationController } from "../controllers/organisation.controller";
import { IOrganisationSchema, IEmployeeSchema } from "../types/schemas";
import { IEncryptedToken, StatusCodes } from "../types/login.types";
import { ApiReponse } from "./login.service";
import { tables } from "./globals";
import { EmployeeController } from "../controllers/employee.controller";

export async function insertOrganisation(req: Request, res: Response) {
   const controller = new OrganisationController<IOrganisationSchema>();
   controller.body = req?.body;

   const message = await controller?.insert();
   res.send(message).end();
}

export async function listOfOrganisations(req: Request, res: Response) {
   const controller = new EmployeeController<IEmployeeSchema>();
   const Oid = res?.locals?.payload?.oId;   
   controller.aggregate = [
      {$match: {"organisation_id": Oid}},
      {
         $addFields: {organisation_id: {$toObjectId: "$organisation_id"}}
      },
      {
         $lookup: {
            from: tables?.organisation,
            localField: "organisation_id",
            foreignField: "_id",
            as: "Organisation"
         }
      },
      {$project: {username: 0, password: 0}},
      {$project: {
         organisation_name: {
            $reduce: {
               input: "$Organisation.name",
               initialValue: "",
               in: {$concat: ["$$value", "$$this"]}
            }
         },
         first_name: 1, last_name: 1, phone: 1, email: 1, date_of_birth: 1
      }}    
   ];

   const data: IEmployeeSchema[] = await controller?.list();
   const status: StatusCodes = data?.length ? StatusCodes?.OK : StatusCodes?.NO_DATA;
   const message: string | undefined = data?.length ? undefined : "No Employee found at given Organisation";
   ApiReponse<IEmployeeSchema[]>(res, status, data, message);
}

export async function fetchOrganisation(req: Request, res: Response) {
   const token: IEncryptedToken | null = res?.locals?.payload;
   const controller = new OrganisationController<IOrganisationSchema>();
   const organisation: IOrganisationSchema | null = await controller.findById(token?.oId || "");
   const status: StatusCodes = organisation ? StatusCodes?.OK : StatusCodes?.NO_DATA;
   const message: string | undefined = organisation ? undefined : 'No Organisation found';   
   
   ApiReponse<IOrganisationSchema | null>(res, status, organisation, message);
}