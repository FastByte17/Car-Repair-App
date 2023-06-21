import { Router } from 'express';
import { validator } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { register, login, protect } from '../controller/auth.js'

const router = Router()
router.use('/api', protect)


router.route('/register').post(validator(registerSchema), register)

router.route('/login').post(validator(loginSchema), login)


export default router;
