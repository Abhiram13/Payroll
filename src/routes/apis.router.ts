import {Router} from "../services/export.services";
import {employeeRouter, orgRouter} from "../routes/export.routes";

const apiRouter = new Router();
apiRouter.use({path: '/employee', router: employeeRouter});
apiRouter.use({path: '/organisation', router: orgRouter});

export {apiRouter};