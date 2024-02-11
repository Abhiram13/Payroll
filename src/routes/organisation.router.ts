import {Router, authorization, fetchOrganisation, insertOrganisation, listOfOrganisations} from "../services/export.services";
import {RoleIdentifier} from "../types/export.types"

const orgRouter = new Router();

orgRouter.post('/add', (req, res) => authorization(req, res, [RoleIdentifier?.SuperAdmin]), insertOrganisation);
orgRouter.get("/employees", listOfOrganisations);
orgRouter.get("/list", fetchOrganisation);

export {orgRouter};