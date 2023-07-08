import {Request, Response} from '../services/server';
import * as EmployeeService from "../services/employee.service";
import { authorization } from "../services/middleware.service";
import { RoleIdentifier } from "../types/schemas";
import { Router } from "../services/server";

const authorizationForInsertEmployee = (req: Request, res: Response) => authorization(req, res, [RoleIdentifier?.SuperAdmin]);

const employeeRouter = new Router();

employeeRouter.get('/fetch/:id', EmployeeService.fetchEmployee);
employeeRouter.post('/add', authorizationForInsertEmployee, EmployeeService.insertEmployee);

export default employeeRouter;