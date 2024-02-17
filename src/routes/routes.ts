import {apiRouter} from "./export.routes";
import {Router, login, authentication, authorization} from '../services/export.services';
import {StatusCode} from "../types/export.types";

const router = new Router();

router.use({path: '/api', middlewares: [authentication], router: apiRouter});
router.get('/', (req, res) => {   
   res.json(StatusCode.OK, {statusCode: StatusCode.OK, message: "This is a ping"});
});
router.post('/login', login);
export {router};