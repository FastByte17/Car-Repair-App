import { Router } from 'express';
import { create } from '../controller/task.js'
import { validator } from '../middleware/validate.js';
import { createTaskSchema } from '../utils/validation.js';
import upload from '../utils/multer.js';
const router = Router()

router.route('/create').post(upload.array('images', 5), validator(createTaskSchema), create)


export default router;
