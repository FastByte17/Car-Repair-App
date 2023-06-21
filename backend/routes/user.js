import { Router } from 'express';
import { me } from '../controller/user.js'
const router = Router()

router.route('/me').get(me)


export default router;
