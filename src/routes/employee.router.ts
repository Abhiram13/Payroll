import {authorization, Router, fetchEmployee, insertEmployee} from "../services/export.services";
import {Request, Response, Role} from "../types/export.types"

const authorizationForInsertEmployee = (req: Request, res: Response) => authorization(req, res, [Role?.SuperAdmin]);

const employeeRouter = new Router();

employeeRouter.get('/fetch/:id', fetchEmployee);
employeeRouter.post('/add', authorizationForInsertEmployee, insertEmployee);
employeeRouter.put("/update");

export {employeeRouter};