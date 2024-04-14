import {Router, authorization, fetchOrganisation, insertOrganisation, listOfOrganisations} from "../services/export.services";
import {Role} from "../types/export.types"

const orgRouter = new Router();

orgRouter.post('/add', (req, res) => authorization(req, res, [Role?.SuperAdmin]), insertOrganisation);
orgRouter.get("/employees", listOfOrganisations);
orgRouter.get("/list", (req, res) => authorization(req, res, [Role?.SuperAdmin]), fetchOrganisation);

export {orgRouter};