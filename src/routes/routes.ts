import { login } from "../services/login.service";
import { authentication } from "../services/middleware.service";
import apiRouter from "./apis.router";
import {Router} from '../services/server';

const router = new Router();

router.use({path: '/api', middlewares: [authentication], router: apiRouter});
router.post('/login', login);
export default router; 