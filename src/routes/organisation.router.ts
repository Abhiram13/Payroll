import * as OrgService from "../services/organisation.service";
import { authorization } from "../services/middleware.service";
import { RoleIdentifier } from "../types/schemas";
import { Router } from "../services/server";

const orgRouter = new Router();

orgRouter.post('/add', (req, res) => authorization(req, res, [RoleIdentifier?.SuperAdmin]), OrgService.insertOrganisation);
orgRouter.get("/employees", OrgService.listOfOrganisations);
orgRouter.get("/list", OrgService.fetchOrganisation);

export default orgRouter;