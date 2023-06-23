import { Router } from 'express';
import { create } from '../controller/task.js'
const router = Router()

router.route('/create').post(create)


export default router;
