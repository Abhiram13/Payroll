import {apiRouter} from "./export.routes";
import {Router, login, authentication, authorization} from '../services/export.services';
import * as os from 'os';

const router = new Router();

router.use({path: '/api', middlewares: [authentication], router: apiRouter});
router.get('/:id/:hello', (req, res) => {
   req.params.hello
   res?.write(`Hi There this is from HOSTNAME: ${os?.hostname()} PORT: ${process?.env?.PORT}`);
   res?.end();
});
router.post('/login', login);
export {router};