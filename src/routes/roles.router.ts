import express from "express";
import * as RoleService from "../services/roles.services";

const rolesRouter = express.Router();

rolesRouter.post("/add", RoleService.insertRoles);
rolesRouter.put("/update/:id", RoleService.updateRoles);
rolesRouter.get("/list", RoleService.listOfRoles);

export default rolesRouter;