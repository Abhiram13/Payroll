import express from "express";
import * as OrgService from "../services/organisation.service";
import { authorization } from "../services/middleware.service";
import { RoleIdentifier } from "../types/schemas";

const orgRouter = express.Router();

orgRouter.post("/add", (req, res, next) => authorization(req, res, next, [RoleIdentifier?.SuperAdmin]), OrgService.insertOrganisation);
orgRouter.get("/employees", OrgService.listOfOrganisations);
orgRouter.get("/fetch", OrgService.fetchOrganisation);

export default orgRouter;