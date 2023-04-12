import express from "express";
import * as OrgService from "../services/organisation.service";

const orgRouter = express.Router();

orgRouter.post("/add", OrgService.insertOrganisation);
orgRouter.get("/employees", OrgService.listOfOrganisations);
orgRouter.get("/fetch", OrgService.fetchOrganisation);

export default orgRouter;