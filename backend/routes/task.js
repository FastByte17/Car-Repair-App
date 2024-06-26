import { Router } from 'express';
import { create, findAll, update, reOrder, deleteTask, getTask } from '../controller/task.js'
import { validator } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../utils/validation.js';
import upload from '../utils/multer.js';
const router = Router()

router.route('/').get(findAll)

router.route('/:taskId').patch(upload.array('images', 5), validator(updateTaskSchema), update).delete(deleteTask).get(getTask)

router.route('/').patch(reOrder)

router.route('/').post(upload.array('images', 5), validator(createTaskSchema), create)




export default router;
