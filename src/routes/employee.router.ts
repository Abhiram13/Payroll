import express, { NextFunction, Request, Response } from "express";
import * as EmployeeService from "../services/employee.service";
import { authorization } from "../services/middleware.service";
import { RoleIdentifier } from "../types/schemas";

const employeeRouter = express.Router();

// middleware to authorise only Super admin to access the API
const authorizationForInsertEmployee = (req: Request, res: Response, next: NextFunction) => authorization(req, res, next, [RoleIdentifier?.SuperAdmin]);

employeeRouter.post("/add", authorizationForInsertEmployee, EmployeeService.insertEmployee);
employeeRouter.get("/fetch/:id", EmployeeService.fetchEmployee);

export default employeeRouter;