import {authorization, Router, fetchEmployee, insertEmployee} from "../services/export.services";
import {Request, Response, RoleIdentifier} from "../types/export.types"

const authorizationForInsertEmployee = (req: Request, res: Response) => authorization(req, res, [RoleIdentifier?.SuperAdmin]);

const employeeRouter = new Router();

employeeRouter.get('/fetch/:id', fetchEmployee);
employeeRouter.post('/add', authorizationForInsertEmployee, insertEmployee);

export {employeeRouter};