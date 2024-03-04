import {Router} from "../services/export.services";
import {employeeRouter, orgRouter, rolesRouter} from "./export.router";

const apiRouter = new Router();
apiRouter.use({path: '/employee', router: employeeRouter});
apiRouter.use({path: '/organisation', router: orgRouter});
apiRouter.use({path: '/roles', router: rolesRouter});

export {apiRouter};