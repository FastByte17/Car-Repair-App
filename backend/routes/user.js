import { Router } from 'express';
import { me, getWorkers } from '../controller/user.js'
const router = Router()

router.route('/me').get(me)

router.route('/workers').get(getWorkers)


export default router;
