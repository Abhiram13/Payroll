import {Router, login, authentication} from '../services/export.services';
import {apiRouter} from "./export.router";
import {StatusCode} from "../types/export.types";

const router = new Router();

router.use({path: '/api', middlewares: [authentication], router: apiRouter});
router.get('/', (req, res) => {   
   res.json(StatusCode.OK, {statusCode: StatusCode.OK, message: "This is a ping"});
});
router.post('/login', login);

export {router};