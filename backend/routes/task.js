import { Router } from 'express';
import { create } from '../controller/task.js'
import { validator } from '../middleware/validate.js';
import { createTaskSchema } from '../utils/validation.js';
const router = Router()

router.route('/create').post(validator(createTaskSchema), create)


export default router;
