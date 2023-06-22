import { Router } from 'express';
import { validator } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { register, login } from '../controller/auth.js'

const router = Router()


router.route('/register').post(validator(registerSchema), register)

router.route('/login').post(validator(loginSchema), login)


export default router;
