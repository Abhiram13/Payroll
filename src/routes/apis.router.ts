import employeeRouter from "./employee.router";
import orgRouter from "./organisation.router";
import { Router } from "../services/server";


const apiRouter = new Router();
apiRouter.use({path: '/employee', router: employeeRouter});
apiRouter.use({path: '/organisation', router: orgRouter});

export default apiRouter;