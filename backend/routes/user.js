import { Router } from 'express';
import { me, getWorkers, check } from '../controller/user.js'
const router = Router()

router.route('/me').get(me)

router.route('/workers').get(getWorkers)

router.route('/check').patch(check)


export default router;
