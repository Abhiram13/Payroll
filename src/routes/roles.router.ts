import express from "express";
import * as RoleService from "../services/roles.services";

const rolesRouter = express.Router();

rolesRouter.post("/add", RoleService.insertRoles);
rolesRouter.get("/list", RoleService.listOfRoles);

export default rolesRouter;