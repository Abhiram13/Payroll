import {listOfRoles} from "../services/roles.services";
import {Router} from "../services/export.services";

const rolesRouter = new Router();

// rolesRouter.post("/add", RoleService.insertRoles);
// rolesRouter.put("/update/:id", RoleService.updateRoles);
rolesRouter.get("/list", listOfRoles);

export {rolesRouter};