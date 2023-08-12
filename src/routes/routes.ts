import { login } from "../services/login.service";
import { authentication } from "../services/middleware.service";
import apiRouter from "./apis.router";
import {Router} from '../services/server';
import * as os from 'os';

const router = new Router();

router.use({path: '/api', middlewares: [authentication], router: apiRouter});
router.get('/', (req, res) => {
   console.log(req.socket.localPort);
   console.log(req.socket.remotePort);
   console.log(process.pid);
   res?.write(`Hi There this is from HOSTNAME: ${os?.hostname()}`);
   res?.end();
});
router.post('/login', login);
export default router; 